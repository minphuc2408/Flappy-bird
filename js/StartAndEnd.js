export function gameScreen(game, gameCtx, gameCanvas) {
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