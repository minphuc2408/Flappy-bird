import Player from "./Player.js";   
import GameConstructor from "./GameConstructor.js";
import GameDrawer from "./GameDrawer.js"
import GameUpdate from "./GameUpdater.js";
import GameKeyHandler from "./GameKeyHandler.js";
import GameReset from "./GameReset.js";
import {ObstacleHandler, BOSS, BOSSSMALL} from "./GameObstacles.js";
import createTime from "./time.js";

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

resizeCanvas();
// window.addEventListener('resize', resizeCanvas);

function main() {  
    class Game {
        constructor() {
            this.gameConstructor = new GameConstructor(this);
            this.keyHandler = new GameKeyHandler(this); 
            this.image = [this.spaceShip1Image, this.spaceShip2Image,this.spaceShip3Image];
            this.players = [];
            this.playerInGame = [...this.players];
            this.boss = new BOSS(this, gameCtx); 
            this.smallBoss = [];
            this.obstacleHandler = new ObstacleHandler(this, gameCtx);
            this.gameReset = new GameReset(this);
            this.gameUpdate = new GameUpdate(this);
            this.gameDrawer = new GameDrawer(this, gameCtx);
            this.gameScreen = gameScreen(this);
            this.time = createTime(); 

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
    
        startGame() {
            this.isGameStarted = true;
            this.isGameover = false;
            this.startTime = performance.now(); // Đặt thời gian bắt đầu game chính xác tại thời điểm nhấn Space
            this.time.start(); // Bắt đầu bộ đếm thời gian
            this.updateGame();
        }

        render() {
            this.resetGame();
            if (!this.isGameStarted) {
                this.gameScreen.drawStartScreen();
            }
        }
        
        updateGame() { 
            this.gameUpdate.update();
            if (this.smallBoss.length < 4) {
                for (let i = 0; i < 4; i++) {
                    const smallBoss = new BOSSSMALL(this, gameCtx, 0); 
                    let y = (gameCanvas.height - smallBoss.height) / 5 * (i + 1); 
                    smallBoss.y = y; 
                    this.smallBoss.push(smallBoss);
                }
            }
        }
        
        drawGame() {
            this.gameDrawer.draw();
        }
        
        resetGame() {
            this.gameReset.reset();
        }

        getCurrentGameTime() {
            if (!this.isGameStarted) {
                return 0; // Nếu game chưa bắt đầu, trả về 0
            }
            return (performance.now() - this.startTime) / 1000; // Thời gian hiện tại của trò chơi tính bằng giây
        }
    }

    // alert("Hãy thiết lập camera để chơi game");
    document.querySelector(".btn-start-game").addEventListener("click", () => {
        document.querySelector(".header").classList.replace("visible", "hidden");
        document.querySelector(".tutorial").classList.replace("hidden", "visible");
    });

    const buttonPlayer = document.querySelectorAll('.btn-play');
    const game = new Game();

    const images = [
        game.spaceShip2Image,
        game.spaceShip1Image,
        game.spaceShip3Image,
        game.spaceBackground,
        game.fireballImage,
        game.iceballImage,
        game.asteroidImage,
        game.blackHoleImage,
        game.cosmicDustImage,
        game.neptuneImage,
        game.uranusImage,
        game.saturnImage,
        game.marsImage,
        game.mercuryImage,
        game.jupiterImage,
        game.venusImage,
        game.ufoBossImage,
        game.ufochild1Image,
        game.ufochild2Image,
        game.ufochild3Image,
        game.ufoComeImage,
        game.missileImage,
        game.healthImage,
        game.shieldImage
    ];
    
    let imagesLoaded = 0;
    let selectPlayers = 0;
    for (let i = 0; i < images.length; i++) {
        images[i].onload = () => {
            imagesLoaded++;
            if (imagesLoaded === images.length) {
                buttonPlayer.forEach((btn, index) => {
                    btn.addEventListener('click', () => {
                        document.querySelector(".tutorial").classList.replace("visible", "hidden");
                        document.querySelector(".game-fla-bird").classList.remove("hidden", "visible");

                        selectPlayers = index + 1
                        game.updatePlayers(selectPlayers);
                    });
                });
                game.render();
            }
        };
    }
}
main();

function resizeCanvas() {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
}

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
        gameCtx.font = '30px Arial';
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
            game.resetGame();
            drawStartScreen();
            document.body.removeChild(gameOverContainer);
            gameOverDisplayed = false;
        };
        buttonContainer.appendChild(yesButton);

        const noButton = document.createElement('button');
        noButton.className = 'restart-btn';
        noButton.innerText = 'NO';
        noButton.onclick = () => {
            game.resetGame();
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