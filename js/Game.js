import Player from "./Player.js";   
import GameConstructor from "./GameConstructor.js";
import {ObstacleHandler, BOSS, BOSSSMALL} from "./GameObstacles.js";
import Handgestrue from "./Handgestrue.js";
import { gameScreen } from "./StartAndEnd.js";

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

class Game {
    constructor() {
        //Key 
        this.handgestrue = new Handgestrue(this);
        this.hasTouch = false;
        //Src image
        this.gameConstructor = new GameConstructor(this);
        //Player
        this.image = [this.spaceShip1Image, this.spaceShip2Image,this.spaceShip3Image];
        this.players = [];
        this.playerInGame = [...this.players]; 
        //Obstacle
        this.obstacleHandler = new ObstacleHandler(this, gameCtx);
        this.boss = new BOSS(this, gameCtx); 
        this.smallBoss = [];
        //Game score
        this.scoreOverall = 0;
        this.scorePlayers = [];
        //Start screen
        this.gameScreen = gameScreen(this, gameCtx, gameCanvas);
        //Time
        this.startTime = 0;
        this.currentTime = 0;
        this.isGameStarted = false;
        this.isGameOver = false;
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

    render(deltaTime = 0) {
        if (!this.isGameStarted && !this.isGameOver) {
            this.gameScreen.drawStartScreen();
            return;
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
        //Obstacle
        this.obstacleHandler.draw();
        this.boss.draw(gameTime);
        this.smallBoss.forEach(smallBoss => {
            smallBoss.draw(gameTime);
        });

        // Time 
        gameCtx.save();
        gameCtx.fillStyle = "#fff";
        gameCtx.font = "20px Ubuntu";
        gameCtx.fillText(`Time: `+ gameTime.toFixed(2) + "s", gameCanvas.width - 120, 30);
        gameCtx.restore();
    }

    update(gameTime, deltaTime) {
        //Obstacle
        this.obstacleHandler.update(gameTime, deltaTime);

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
        this.playerInGame = [...this.players]
        this.currentTime = 0;
        this.startTime = 0;
        this.isGameStarted = false;
        this.isGameOver = false;
        this.scoreOverall = 0;
        this.scorePlayers = [];
        this.shieldActive = false;
        this.obstacleHandler.reset();
        this.boss.reset();
        this.smallBoss.forEach(smallBoss => {
            smallBoss.reset();
        });
        this.hasTouch =false;
    }

    getCurrentGameTime() {
        if (!this.isGameStarted) {
            return 0;
        }
        return (performance.now() - this.startTime) / 1000; 
    }
}

export default Game;
