import {Player, PlayerMedium} from "./Player.js";   
import GameConstructor from "./GameConstructor.js";
import {ObstacleHandler, BOSS, BOSSSMALL, ObstacleNumberAndAlphabet} from "./GameObstacles.js";
import Handgesture from "./Handgesture.js";
import { gameScreen } from "./StartAndEnd.js";

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

class Game {
    constructor() {
        //Key 
        this.handgesture = new Handgesture(this);
        this.hasTouch = false;
        //Src image
        this.loadImage = false;
        this.gameConstructor = new GameConstructor(this);
        //Player
        this.image = [this.spaceShip1Image, this.spaceShip2Image,this.spaceShip3Image];
        this.players = [];
        this.playerInGame = [...this.players]; 
        //Obstacle
        this.obstacleNumberAndAlphabet = new ObstacleNumberAndAlphabet(this, gameCtx);
        this.obstacleHandler = new ObstacleHandler(this, gameCtx);
        this.boss = new BOSS(this, gameCtx); 
        this.smallBoss = [];
        this.letters = [];
        //Game score
        this.scoreOverall = 0;
        this.scorePlayers = [];
        //Start screen
        this.gameScreen = gameScreen(this, gameCtx, gameCanvas, this.handgesture);
        //Time
        this.startTime = 0;
        this.currentTime = 0;
        this.isGameStarted = false;
        this.isGameOver = false;
        this.pause = false;
    }
    
    udpatePlayerHandgestrue() {
        this.players = [];
        this.players.push(new Player(this, this.spaceShip1Image, gameCtx, 1));
        this.playerInGame = [...this.players];
    }
    
    render(deltaTime = 0) {
        if (!this.isGameStarted && !this.isGameOver) {
            this.pause = false;
            this.gameScreen.drawStartScreen();
            if(this.handgesture.isHandClosed()) {
                this.startTime = performance.now();
                this.isGameStarted = true;
            }
            return;
        }
        
        if(this.pause && !this.isGameOver) {
            this.gameScreen.pauseGameScreen();
            return;
        }
        
        if (this.isGameOver) {
            this.gameScreen.drawGameOverScreen(); 
            return;
        }
        if(deltaTime <= 0) {
            return;
        }
        
        if(this.pause) {
            this.currentTime = this.currentTime - this.getPauseGameTime();
        } else {
            this.currentTime = this.getCurrentGameTime();
        }
        this.draw(this.currentTime);
        this.update(this.currentTime, deltaTime);
    }

    draw(gameTime) {
        gameCtx.drawImage(this.spaceBackground, 0, 0, gameCanvas.width, gameCanvas.height);
        //Player
        let gap = 0;
        this.players.forEach((player, index) => {
            // switch (index + 1) {
            //     case 1:
            //         player.drawLargeLaser("#ACE6FF", "#73D5FF");
            //         break;
            //     case 2: 
            //         player.drawLargeLaser("#E0FFFF", "#FFC0CB");
            //         break;
            //     case 3:
            //         player.drawLargeLaser("#FFF5F7", "#AFEEEE");
            //         break;
            // }
            player.draw(gap + 80, 30, gap + 15, 60, gap + 15, 90, gap + 10, 10);
            gap += 250;
        });

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

    reset() {
        this.playerInGame = [...this.players];
        this.currentTime = 0;
        this.startTime = 0;
        this.isGameStarted = false;
        this.isGameOver = false;
        this.scoreOverall = 0;
        this.scorePlayers = [];
        this.shieldActive = false;
        this.obstacleHandler.reset();
        this.obstacleNumberAndAlphabet.reset();
        this.boss.reset();
        this.smallBoss.forEach(smallBoss => {
            smallBoss.reset();
        });
        this.players.forEach(player => {
            player.reset();
        });
        this.hasTouch = false;
        this.loadImage = false;
    }

    getCurrentGameTime() {
        if (!this.isGameStarted) {
            return 0;
        }
        return (performance.now() - this.startTime) / 1000;
    }

    getPauseGameTime() {
        if (!this.pause) {
            return 0;
        }
        return (performance.now() - this.pauseTime) / 1000;
    }

}

class GameEasy extends Game {
    constructor() {
        super();
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
        this.obstacleHandler.drawObstacles();
        this.obstacleHandler.drawMovingObstacles();
    }
}

class GameChild extends Game {
    constructor() {
        super();
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
        // this.obstacleNumberAndAlphabet.createRandomMovingObstacles(gameTime);
        if( this.obstacleNumberAndAlphabet.framesSinceLastObstacle >=  1.5) {
            this.obstacleNumberAndAlphabet.pushObstacle(gameTime);
            this.obstacleNumberAndAlphabet.framesSinceLastObstacle = 0;
        }
    }

    draw(gameTime) {
        super.draw(gameTime);
        this.obstacleNumberAndAlphabet.drawObstacles();
    }
}

class GameMedium extends Game {
    constructor() {
        super();
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
        this.obstacleHandler.framesSinceLastObstacle += deltaTime;
        this.obstacleHandler.createRandomMovingObstacles(gameTime);
        if( this.obstacleHandler.framesSinceLastObstacle >= 1) {
            this.obstacleHandler.pushObstacle(gameTime);
            this.obstacleHandler.framesSinceLastObstacle = 0;
        }
    }

    draw(gameTime) {
        super.draw(gameTime);
        this.obstacleHandler.drawObstacles();
        this.obstacleHandler.drawMovingObstacles();
    }
}

class GameHard extends Game {
    constructor() {
        super();
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
        console.log(this.boss.x)
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

        if (this.smallBoss.length < 4) {
            for (let i = 0; i < 4; i++) {
                const smallBoss = new BOSSSMALL(this, gameCtx, 0); 
                let y = (gameCanvas.height - smallBoss.height) / 5 * (i + 1); 
                smallBoss.y = y; 
                this.smallBoss.push(smallBoss);
            }
        }
        this.smallBoss.forEach(smallBoss => {
            smallBoss.update(gameTime, deltaTime);
        });

        this.boss.update(gameTime, deltaTime);
        if(this.boss.x >= gameCanvas.width) {
            this.boss.reset();
        }
    }

    draw(gameTime) {
        super.draw(gameTime);
        this.obstacleHandler.drawObstacles();
        this.obstacleHandler.drawMovingObstacles();
        this.boss.draw(gameTime);
        this.smallBoss.forEach((smallBoss) => {
            smallBoss.draw(gameTime);
        });
    }
}

export {GameHard, GameMedium, GameEasy, GameChild, Game};