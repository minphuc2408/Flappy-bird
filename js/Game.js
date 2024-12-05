import Player from "./Player.js";   
import GameConstructor from "./GameConstructor.js";
// import KeyHandler from "./KeyHandler.js";
import {ObstacleHandler, BOSS, BOSSSMALL} from "./GameObstacles.js";
import Handgestrue from "./Handgestrue.js";

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

class Game {
    constructor() {
        //Key 
        this.spacePressed = false;
        // this.keyHandler = new KeyHandler(this);
        this.handgestrue = new Handgestrue(this);
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
        this.gameScreen = gameScreen(this);
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
        this.players.forEach((player) => {
            player.drawPlayer(gap + 15, 60, gap + 50, 30);
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
            player.updatePlayer(deltaTime);
        });

        this.playerInGame = this.playerInGame.filter(player => player.isAlive);

        if(this.playerInGame.length === 0) {
            this.isGameOver = true;
            this.players.forEach(player => {
                player.resetPlayer();
            });
            this.playerInGame = [...this.players];
        }
    }

    reset() {
        this.playerInGame = [...this.players]
        this.currentTime = 0;
        this.startTime = 0;
        this.spacePressed = false;
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
    }

    getCurrentGameTime() {
        if (!this.isGameStarted) {
            return 0;
        }
        return (performance.now() - this.startTime) / 1000; 
    }
}
window.addEventListener('load', function () {
    const gameflabird = document.querySelector(".game-fla-bird");

    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    document.querySelector(".btn-start-game").addEventListener("click", () => {
        document.querySelector(".header").classList.replace("visible", "hidden");
        document.querySelector(".tutorial").classList.replace("hidden", "visible");
    });

    const buttonPlayer = document.querySelectorAll('.btn-play');
    let selectPlayers = 0;
    
    const game = new Game();

    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    buttonPlayer.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            document.querySelector(".tutorial").classList.replace("visible", "hidden");
            gameflabird.classList.replace("hidden", "visible");
            selectPlayers = index;
            if(index === 0) {
                game.handgestrue.start();
                game.udpatePlayerHandgestrue(selectPlayers);
            } else {
                game.updatePlayers(selectPlayers);
            }
        });
    });

    const key = ["Space", "KeyA", "keyL"];
    window.addEventListener("keydown", (e) => {
        if(gameflabird.classList.contains("visible") && e.code === "Enter") {
            game.startTime = performance.now();
            game.isGameStarted = true;
            game.render(); 
        }

        game.players.forEach((player, index) => {
            if(game.isGameStarted) {
                let keyPlay = key[index];
                if(player.currentHealth > 0 && !player.pressed && e.code === keyPlay) {
                    player.flap();
                    player.pressed = true;
                }
            }
        });
    });

    window.addEventListener("keyup" , (e) => {
        game.players.forEach((player, index) => {
            const playerKey = key[index];
            if (e.code === playerKey) {
                player.pressed = false;
            }
        });
    });

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = (timeStamp - lastTime) / 1000;    
        lastTime = timeStamp;

        game.render(deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);
});

function gameScreen(game) {
    let gameOverDisplayed = false;

    function drawBlurredBackground() {
        gameCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

    function drawStartScreen () {
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.drawImage(game.spaceBackground, 0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.fillStyle = 'white';
        gameCtx.font = '30px Ubuntu';
        gameCtx.textAlign = 'center';
        gameCtx.fillText('Press Enter to start', gameCanvas.width / 2, gameCanvas.height / 2);
    }

    function drawGameOverScreen () {
        if(gameOverDisplayed) return;

        game.isGameStarted = false;
        gameOverDisplayed = true;

        drawBlurredBackground(gameCtx, gameCanvas);
        const gameOverContainer = document.createElement("div");
        gameOverContainer.className = "game-over-container";
        const gameOverTitle = document.createElement("div");

        gameOverTitle.className = "game-over-title";
        gameOverTitle.innerText = "Game Over"
        gameOverContainer.appendChild(gameOverTitle);

        const scores = document.createElement('div');
        scores.className = 'scores';
        gameOverContainer.appendChild(scores);

        game.scorePlayers.forEach((player) => {
            let scoreText = document.createElement("div");
            scoreText.className = "score-text";
            scoreText.innerText = `Score player ${player.id}: ${player.score}`;
            scores.appendChild(scoreText);
        });

        const playAgainText = document.createElement('div');
        playAgainText.className = 'play-again-text';
        playAgainText.innerText = 'Play Again?';
        gameOverContainer.appendChild(playAgainText);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const yesButton = document.createElement('button');
        yesButton.className = 'restart-btn';
        yesButton.innerText = 'YES';
        yesButton.onclick = () => {
            game.reset();
            drawStartScreen();
            document.body.removeChild(gameOverContainer);
            gameOverDisplayed = false;
        };
        buttonContainer.appendChild(yesButton);

        const noButton = document.createElement('button');
        noButton.className = 'restart-btn';
        noButton.innerText = 'NO';
        noButton.onclick = () => {
            game.handgestrue.stop();
            game.reset();
            document.querySelector('.game-fla-bird').classList.replace('visible', 'hidden');
            document.querySelector('.tutorial').classList.replace('hidden', 'visible');

            document.body.removeChild(gameOverContainer);
            gameOverDisplayed = false;
        };
        buttonContainer.appendChild(noButton);

        gameOverContainer.appendChild(buttonContainer);

        document.body.appendChild(gameOverContainer);
    }

    return {
        drawBlurredBackground,
        drawStartScreen,
        drawGameOverScreen
    };
}
