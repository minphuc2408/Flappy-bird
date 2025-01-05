import {Player, PlayerMedium, PlayerHard} from "./Player.js";   
import GameConstructor from "./GameConstructor.js";
import {ObstacleHandler, BOSSMEDIUM, BOSSSMALL, ObstacleNumberAndAlphabet, BOSSHARD, BOSSSMALLHARD, BOSSSMALLMEDIUM } from "./GameObstacles.js";
import Handgesture from "./Handgesture.js";
import { gameScreen } from "./StartAndEnd.js";

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

class Game {
    constructor(name) {
        //name
        this.name = name;
        //Key 
        this.handgesture = new Handgesture(this);
        this.hasTouch = false;
        //Src image
        this.loadImage = false;
        this.gameConstructor = new GameConstructor(this);
        //Player
        this.image = [this.spaceShip1Image, this.spaceShip2Image, this.spaceShip3Image];
        this.players = [];
        this.playerInGame = [...this.players]; 
        //Obstacle
        this.obstacleNumberAndAlphabet = new ObstacleNumberAndAlphabet(this, gameCtx);
        this.obstacleHandler = new ObstacleHandler(this, gameCtx);
        this.letters = [];
        //Game score
        this.scoreOverall = 0;
        this.scorePlayers = [];
        this.highScore = [];
        this.loadHighScore();
        //Start screen
        this.gameScreen = gameScreen(this, gameCtx, gameCanvas, this.handgesture);
        //Time
        this.startTime = 0;
        this.currentTime = 0;
        this.totalPauseTime = 0;  // Tổng thời gian đã pause
        this.lastPauseStartTime = 0;  // Thời điểm bắt đầu pause gần nhất
        this.isGameStarted = false;
        this.isGameOver = false;
        this.pause = false;
        //Sound
        this.flapSound = document.getElementById("flap");
        this.playerDieSound = document.getElementById("player-die");
        this.startGameSound = document.getElementById("start-game");
        this.playerShootSound = document.getElementById("player-shoot");

        this.collisionSound = document.getElementById("player-collision");
        this.collisionSound.volume = 0.5;
        this.collectSound = document.getElementById("collect");
        this.collectSound.volume = 0.5;

        this.shoot = document.getElementById('boss-shoot');  
        this.fireAndSnowSound = document.getElementById("boss-fire-and-snow");
    }

    playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    saveHighScore() {
        const key = `Game_${this.name}_highScore`
        localStorage.setItem(key, JSON.stringify(this.highScore));
    }

    loadHighScore() {
        const key = `Game_${this.name}_highScore`
        const highScoreString = localStorage.getItem(key);
        if (highScoreString) {
            this.highScore = JSON.parse(highScoreString);
        }
    }

    render(deltaTime = 0) {
        if (!this.isGameStarted && !this.isGameOver) {
            this.pause = false;
            this.totalPauseTime = 0;
            this.lastPauseStartTime = 0;
            this.gameScreen.drawStartScreen();
            if(this.handgesture.isHandClosed()) {
                this.startTime = performance.now();
                this.isGameStarted = true;
            }
            return;
        }
        
        if(this.pause && !this.isGameOver) {
            if (this.lastPauseStartTime === 0) {
                this.lastPauseStartTime = performance.now();
            }
            this.gameScreen.pauseGameScreen();
            return;
        }

        if (!this.pause && this.lastPauseStartTime !== 0) {
            this.totalPauseTime += performance.now() - this.lastPauseStartTime;
            this.lastPauseStartTime = 0;
        }
        
        if (this.isGameOver) {
            this.gameScreen.drawGameOverScreen(); 
            return;
        }
        
        if(deltaTime <= 0) {
            return;
        }
        
        this.currentTime = this.getCurrentGameTime();
        this.draw(this.currentTime);
        this.update(this.currentTime, deltaTime);
    }

    draw(gameTime) {
        gameCtx.drawImage(this.spaceBackground, 0, 0, gameCanvas.width, gameCanvas.height);
        // Time 
        gameCtx.save();
        gameCtx.fillStyle = "#fff";
        gameCtx.font = "20px Ubuntu";
        gameCtx.fillText(`Time: `+ gameTime.toFixed(2) + "s", gameCanvas.width - 140, 30);
        gameCtx.restore();
    }

    update(gameTime, deltaTime) {
        if(this.handgesture.isRunning) {
            if (this.handgesture.isHandClosed() && !this.handgesture.hold && !this.players[0].isFalling) {
                this.players[0].flap();
                this.players[0].currentMana -= 5;  
                this.handgesture.hold = true;
            } else if (!this.handgesture.isHandClosed()) {
                this.handgesture.hold = false;
            }
    
            if(this.handgesture.pauseGame()) {
                this.pause = true;
            }
        }
        //Player
        this.playerInGame.forEach(player => {
            player.update(deltaTime);
        });

        this.playerInGame = this.playerInGame.filter(player => player.isAlive);

        if(this.playerInGame.length === 0) {
            this.isGameOver = true;
            this.players.forEach(player => {
                player.reset();
            });
            this.playerInGame = [...this.players];
        }
    }

    getCurrentGameTime() {
        if (!this.isGameStarted) {
            return 0;
        }
        const currentTime = performance.now();
        let gameTime = (currentTime - this.startTime - this.totalPauseTime) / 1000;
        if (this.pause && this.lastPauseStartTime !== 0) {
            gameTime -= (currentTime - this.lastPauseStartTime) / 1000;
        }
        
        return gameTime;
    }

    reset() {
        this.playerInGame = [...this.players];
        this.currentTime = 0;
        this.startTime = 0;
        this.totalPauseTime = 0;
        this.lastPauseStartTime = 0;
        this.isGameStarted = false;
        this.isGameOver = false;
        this.scoreOverall = 0;
        this.scorePlayers = [];
        this.shieldActive = false;
        this.obstacleHandler.reset();
        this.obstacleNumberAndAlphabet.reset();
        this.players.forEach(player => {
            player.reset();
        });
        this.hasTouch = false;
        this.loadImage = false;
        this.frames = 0;
        this.fps = 0;
    }
}

class GameEasy extends Game {
    constructor() {
        super("GameEasy");
        this.sound = document.getElementById("game");
        this.sound.addEventListener("ended", () => {
            this.sound.currentTime = 0;
            this.sound.play();
        });
    }

    udpatePlayerHandgestrue() {
        this.players = [];
        this.players.push(new Player(this, this.spaceShip1Image, gameCtx, 1));
        this.playerInGame = [...this.players];
    }

    updatePlayers(players) {
        this.players = []; //1 line bug 2 hours
        for (let i = 0; i < players; i++) {
            let player;
            player = new Player(this, this.image[i], gameCtx, i + 1);
            this.players.push(player);
        }
        this.playerInGame = [...this.players];
    }
    
    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);
        //Obstacle
        this.obstacleHandler.updateObstacles(gameTime, deltaTime);
        this.obstacleHandler.updateMovingObstacles(this.obstacleHandler.asteroids, deltaTime, "asteroid");
        this.obstacleHandler.updateMovingObstacles(this.obstacleHandler.missiles, deltaTime, "missile");
        this.obstacleHandler.framesSinceLastObstacle += deltaTime;
        this.obstacleHandler.createRandomMovingObstacles(gameTime);
        if( this.obstacleHandler.framesSinceLastObstacle >=  1.5) {
            this.obstacleHandler.pushObstacle(gameTime);
            this.obstacleHandler.framesSinceLastObstacle = 0;
        }
    }

    draw(gameTime) {
        super.draw(gameTime);
        let gapPlayer = 0;
        this.players.forEach((player, index) => {
            if(player.isAlive) {
                player.draw(gapPlayer + 80, 30, gapPlayer + 15, 60, gapPlayer + 15, 90, gapPlayer + 10, 10);
            }
            gapPlayer += 250;
        });
        this.obstacleHandler.drawObstacles();
        this.obstacleHandler.drawMovingObstacles();
    }
}

class GameChild extends Game {
    constructor() {
        super("GameChild");
        this.sound = document.getElementById("gameChild");
    }

    udpatePlayerHandgestrue() {
        this.players = [];
        this.players.push(new Player(this, this.spaceShip1Image, gameCtx, 1));
        this.playerInGame = [...this.players];
    }

    updatePlayers(players) {
        this.players = []; //1 line bug 2 hours
        for (let i = 0; i < players; i++) {
            let player;
            player = new Player(this, this.image[i], gameCtx, i + 1);
            this.players.push(player);
        }
        this.playerInGame = [...this.players];
    }

    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);
        this.obstacleNumberAndAlphabet.updateObstacles(gameTime, deltaTime);
        this.obstacleNumberAndAlphabet.framesSinceLastObstacle += deltaTime;
        if( this.obstacleNumberAndAlphabet.framesSinceLastObstacle >=  1.7) {
            this.obstacleNumberAndAlphabet.pushObstacle(gameTime);
            this.obstacleNumberAndAlphabet.framesSinceLastObstacle = 0;
        }
    }

    draw(gameTime) {
        super.draw(gameTime);
        let gapPlayer = 0;
        this.players.forEach((player, index) => {
            if(player.isAlive) {
                player.draw(gapPlayer + 80, 30, gapPlayer + 15, 60, gapPlayer + 15, 90, gapPlayer + 10, 10);
            }
            gapPlayer += 250;
        });
        this.obstacleNumberAndAlphabet.drawObstacles();
    }
}

class GameChildEasy extends GameChild {
    constructor() {
        super("GameChild");
    }

    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);
        this.obstacleNumberAndAlphabet.updateObstacles(gameTime, deltaTime);
        this.obstacleNumberAndAlphabet.framesSinceLastObstacle += deltaTime;
        if( this.obstacleNumberAndAlphabet.framesSinceLastObstacle >=  1.7) {
            this.obstacleNumberAndAlphabet.pushObstacle(gameTime);
            this.obstacleNumberAndAlphabet.framesSinceLastObstacle = 0;
        }
    }
}

class GameMedium extends Game {
    constructor() {
        super("GameMedium");
        this.boss = [];
        this.smallBoss = [];
        this.smallBossMax = 4;
        this.smallBossOnce = true;
        this.sound = document.getElementById("game");
    }

    updateSmallBoss() {
        for (let i = 0; i < this.smallBossMax; i++) {
            const smallBoss = new BOSSSMALLMEDIUM(this, gameCtx, 0); 
            let y = (gameCanvas.height - smallBoss.height) / 5 * (i + 1); 
            smallBoss.y = y; 
            this.smallBoss.push(smallBoss);
        }
        this.boss.push(new BOSSMEDIUM(this, gameCtx));
    }

    udpatePlayerHandgestrue() {
        this.players = [];
        this.players.push(new PlayerMedium(this, this.spaceShip1Image, gameCtx, 1));
        this.playerInGame = [...this.players];
    }

    updatePlayers(players) {
        this.players = []; //1 line bug 2 hours
        for (let i = 0; i < players; i++) {
            let player;
            player = new PlayerMedium(this, this.image[i], gameCtx, i + 1);
            this.players.push(player);
        }
        this.playerInGame = [...this.players];
    }
    
    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);
        //Obstacle
        this.obstacleHandler.updateObstacles(gameTime, deltaTime);
        this.obstacleHandler.updateMovingObstacles(this.obstacleHandler.asteroids, deltaTime, "asteroid");
        this.obstacleHandler.updateMovingObstacles(this.obstacleHandler.missiles, deltaTime, "missile");
        if(gameTime % 60 < 30) {
            this.obstacleHandler.framesSinceLastObstacle += deltaTime;
            this.obstacleHandler.createRandomMovingObstacles(gameTime);
            if(this.obstacleHandler.framesSinceLastObstacle >=  this.obstacleHandler.obstaclesInterval) {
                this.obstacleHandler.pushObstacle(gameTime);
                this.obstacleHandler.framesSinceLastObstacle = 0;
            }
        }

        if(this.smallBossOnce) {
            this.updateSmallBoss();
            this.smallBossOnce = false;
        }

        this.smallBoss.forEach((smallBoss, index) => {
            smallBoss.update(gameTime, deltaTime);
        });

        this.boss.forEach((boss, index) => {
            boss.update(gameTime, deltaTime);
            if(boss.x >= gameCanvas.width) {
                boss.y = gameCanvas.height / 2 - boss.y / 2;
            }
        });
    }

    draw(gameTime) {
        super.draw(gameTime);
        let gapPlayer = 0;
        this.players.forEach((player, index) => {
            if(player.isAlive) {
                player.draw(gapPlayer + 80, 30, gapPlayer + 15, 60, gapPlayer + 15, 90, gapPlayer + 10, 10);
            }
            gapPlayer += 250;
        });
        this.obstacleHandler.drawObstacles();
        this.obstacleHandler.drawMovingObstacles();
        this.smallBoss.forEach((smallBoss) => {
            smallBoss.draw(gameTime);
        });
        this.boss.forEach((boss) => {
            boss.draw(gameTime);
        });
    }

    reset() {
        super.reset();
        this.smallBoss.forEach(smallBoss => {
            smallBoss.reset();
        });
        this.boss.forEach(boss => {
            boss.reset();
        });
    }
}

class GameHard extends Game {
    constructor() {
        super("GameHard");
        this.boss = [];
        this.smallBoss = [];
        this.smallBossMax = 4;
        this.smallBossOnce = true;
        this.sound = document.getElementById("game");
    }

    updateSmallBoss() {
        for (let i = 0; i < this.smallBossMax; i++) {
            const smallBoss = new BOSSSMALLHARD(this, gameCtx, 0); 
            let y = (gameCanvas.height - smallBoss.height) / 5 * (i + 1); 
            smallBoss.y = y; 
            this.smallBoss.push(smallBoss);
        }
        this.boss.push(new BOSSHARD(this, gameCtx));
    }

    udpatePlayerHandgestrue() {
        this.players = [];
        this.players.push(new PlayerHard(this, this.spaceShip1Image, gameCtx, 1));
        this.playerInGame = [...this.players];
    }

    updatePlayers(players) {
        this.players = []; //1 line bug 2 hours
        for (let i = 0; i < players; i++) {
            let player;
            player = new PlayerHard(this, this.image[i], gameCtx, i + 1);
            this.players.push(player);
        }
        this.playerInGame = [...this.players];
    }

    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);
        //Obstacle
        this.obstacleHandler.updateObstacles(gameTime, deltaTime);
        this.obstacleHandler.updateMovingObstacles(this.obstacleHandler.asteroids, deltaTime, "asteroid");
        this.obstacleHandler.updateMovingObstacles(this.obstacleHandler.missiles, deltaTime, "missile");
        if(gameTime % 90 < 30) {
            this.obstacleHandler.framesSinceLastObstacle += deltaTime;
            this.obstacleHandler.createRandomMovingObstacles(gameTime);
            if(this.obstacleHandler.framesSinceLastObstacle >=  this.obstacleHandler.obstaclesInterval) {
                this.obstacleHandler.pushObstacle(gameTime);
                this.obstacleHandler.framesSinceLastObstacle = 0;
            }
        }

        if(this.smallBossOnce) {
            this.updateSmallBoss();
            this.smallBossOnce = false;
        }

        this.smallBoss.forEach((smallBoss, index) => {
            if(smallBoss.y + smallBoss.height < gameCanvas.height) {
                smallBoss.update(gameTime, deltaTime);
            } else {
                this.smallBoss.splice(index, 1);
            }
        });

        this.boss.forEach((boss, index) => {
            if(boss.y + boss.height < gameCanvas.height) {
                boss.update(gameTime, deltaTime);
            } else {
                this.boss.splice(index, 1);
            }

            if(boss.x >= gameCanvas.width) {
                boss.y = gameCanvas.height / 2 - boss.y / 2;
            }
        });
    }

    draw(gameTime) {
        super.draw(gameTime);
        let gapPlayer = 0;
        this.players.forEach((player, index) => {
            switch (index + 1) {
                case 1:
                    player.drawLargeLaser("#8CD4FC", "#88D8FC");
                    break;
                case 2: 
                    player.drawLargeLaser("#E0FFFF", "#FFC0CB");
                    break;
                case 3:
                    player.drawLargeLaser("#ACE6FF", "#AFEEEE");
                    break;
            }
            if(player.isAlive) {
                player.draw(gapPlayer + 80, 30, gapPlayer + 15, 60, gapPlayer + 15, 90, gapPlayer + 10, 10, gapPlayer + 80, gapPlayer + 30);
            }
            gapPlayer += 250;
        });
        this.obstacleHandler.drawObstacles();
        this.obstacleHandler.drawMovingObstacles();
        
        let gapUfo = 70;
        this.smallBoss.forEach((smallBoss) => {
            if(smallBoss.y <= gameCanvas.height) {
                smallBoss.draw(gameTime, 40, gapUfo + 20, 10);
            }
            gapUfo += 20;
        });
        this.boss.forEach((boss) => {
            if(boss.y <= gameCanvas.height) {
                boss.draw(gameTime, 40, 60);
            }
        });
    }

    reset() {
        super.reset();
        this.smallBoss.forEach(smallBoss => {
            smallBoss.reset();
        });
        this.boss.forEach(boss => {
            boss.reset();
        });
        this.smallBossOnce = true;
        this.boss = [];
        this.smallBoss = [];
        
    }
}

export {GameHard, GameMedium, GameEasy, GameChild, Game, GameChildEasy};
