export function gameScreen(game, gameCtx, gameCanvas, hand) {
    let gameOverDisplayed = false;
    let pauseDisplayed = false;
    let gameOverContainer; 
    let pauseContainer; 

    function drawBlurredBackground() {
        gameCtx.save();
        gameCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.restore();
    }

    function drawStartScreen() {
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.drawImage(game.spaceBackground, 0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.fillStyle = 'white';
        gameCtx.font = '30px Ubuntu';
        gameCtx.textAlign = 'center';
        gameCtx.fillText('Press Enter to start', gameCanvas.width / 2, gameCanvas.height / 2);
    }

    function drawGameOverScreen() {
        if (gameOverDisplayed) return;

        game.isGameStarted = false;
        gameOverDisplayed = true;

        drawBlurredBackground(gameCtx, gameCanvas);
        gameOverContainer = document.createElement("div");
        gameOverContainer.className = "game-over-container";
        const gameOverTitle = document.createElement("div");

        gameOverTitle.className = "game-over-title";
        gameOverTitle.innerText = "Game Over"
        gameOverContainer.appendChild(gameOverTitle);

        const scores = document.createElement('div');
        scores.className = 'scores';
        gameOverContainer.appendChild(scores);

        game.scorePlayers.forEach((player) => {
            game.highScore.push(game.scoreOverall);
            let scoreText = document.createElement("div");
            scoreText.className = "score-text";
            scoreText.innerText = `Score player ${player.id}: ${player.score}`;
            scores.appendChild(scoreText);
        });

        const highScore = document.createElement("div");
        game.highScore.sort((a, b) => b - a);
        if (game.highScore.length >= 5) {
            game.highScore.splice(5, 5);
        }
        game.saveHighScore();
        highScore.className = "score-text";
        highScore.innerText = `High Score: ${game.highScore[0]}`
        highScore.style.textAlign = "center"
        scores.appendChild(highScore)
        

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
            if(document.querySelector(".on").classList.contains("hidden")) {
            game.sound.currentTime = 0;
                game.sound.pause();
            } else {
                game.sound.play();
            }
            drawStartScreen();
            document.body.removeChild(gameOverContainer);
            gameOverDisplayed = false;
        };
        buttonContainer.appendChild(yesButton);

        const noButton = document.createElement('button');
        noButton.className = 'restart-btn';
        noButton.innerText = 'NO';
        noButton.onclick = () => {
            game.reset();
            hand.stop();
            game.sound.pause();
            game.sound.currentTime = 0;
            document.getElementById("app").play();
            if(document.querySelector(".off").classList.contains("hidden")) {
                document.querySelector(".on").classList.add("hidden");
                document.querySelector(".off").classList.remove("hidden");
            }

            document.querySelector('.game-fla-bird').classList.replace('visible', 'hidden');
            document.querySelector('.tutorial').classList.replace('hidden', 'visible');
            document.querySelector('.select-mode').classList.remove('hidden');
            document.querySelector('.button-player').classList.add('hidden');
            document.querySelector('.tutorial .button-player:last-of-type').classList.add('hidden');

            document.body.removeChild(gameOverContainer);
            gameOverDisplayed = false;
        };
        buttonContainer.appendChild(noButton);

        gameOverContainer.appendChild(buttonContainer);

        document.body.appendChild(gameOverContainer);

        function checkHandGesture() {
            if(game.isGameOver && hand !== undefined) {
                if (hand.isHandClosed()) {
                    game.reset();
                        drawStartScreen();
    
                    if (gameOverContainer && document.body.contains(gameOverContainer)) {
                        document.body.removeChild(gameOverContainer);
                    }
                    gameOverDisplayed = false;
                } else if(hand.numberTwo()) {
                    hand.stop();
                    game.reset();
                    document.querySelector('.game-fla-bird').classList.replace('visible', 'hidden');
                    document.querySelector('.tutorial').classList.replace('hidden', 'visible');
                    document.querySelector('.choice-player').classList.remove('hidden');
                    document.querySelector('.button-player').classList.add('hidden');
                    document.querySelector('.tutorial .button-player').classList.add('hidden');

                    if (gameOverContainer && document.body.contains(gameOverContainer)) {
                            document.body.removeChild(gameOverContainer);
                        }
                    gameOverDisplayed = false;
                }
                else {
                    requestAnimationFrame(checkHandGesture);
                }
            }
        }
        checkHandGesture();
    }

    function pauseGameScreen() {
        if(pauseDisplayed) return;

        pauseDisplayed = true;

        drawBlurredBackground(gameCtx, gameCanvas);
        pauseContainer = document.createElement("div"); 
        pauseContainer.className = "pause-container";
        const pauseTitle = document.createElement("div");

        pauseTitle.className = "pause-title";
        pauseTitle.innerText = "Pause";
        pauseContainer.appendChild(pauseTitle);

        const resumeText = document.createElement('div');
        resumeText.className = 'resume-text';
        resumeText.innerText = 'Continue?';
        pauseContainer.appendChild(resumeText);

        const buttonContainer = document.createElement("button");
        buttonContainer.className = "button-container";

        const yesButton = document.createElement('button');
        yesButton.className = 'continue-btn';  
        yesButton.innerText = 'YES';
        yesButton.onclick = () => {
            game.pause = false;
            pauseDisplayed = false;
            if (pauseContainer && document.body.contains(pauseContainer)) {
                document.body.removeChild(pauseContainer);
            }
        };
        buttonContainer.appendChild(yesButton);

        const noButton = document.createElement('button');
        noButton.className = 'continue-btn';
        noButton.innerText = 'NO';
        noButton.onclick = () => {
            game.reset();
            drawStartScreen();
            game.pause = false;
            pauseDisplayed = false;
            if (pauseContainer && document.body.contains(pauseContainer)) {
                document.body.removeChild(pauseContainer);
            }
        };
        buttonContainer.appendChild(noButton);
        pauseContainer.appendChild(buttonContainer);
        document.body.appendChild(pauseContainer);

        function checkHandGesture() {
            if (hand.isHandClosed() && game.pause) {
                game.pause = false;
                pauseDisplayed = false;

                if (pauseContainer && document.body.contains(pauseContainer)) {
                    document.body.removeChild(pauseContainer);
                }
            } else if(hand.numberTwo()  && game.pause) {
                game.reset();
                drawStartScreen();
                game.pause = false;
                pauseDisplayed = false;

                if (pauseContainer && document.body.contains(pauseContainer)) {
                    document.body.removeChild(pauseContainer);
                }
            } else {
                requestAnimationFrame(checkHandGesture);
            }
        }
        checkHandGesture();
    }

    return {
        drawBlurredBackground,
        drawStartScreen,
        drawGameOverScreen,
        pauseGameScreen
    };
}