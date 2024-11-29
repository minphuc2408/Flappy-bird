class GameKeyHandler {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
        this.keysPressed = {};

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    handleKeyDown(event) {
        if (gameCanvas && !gameCanvas.classList.contains("visible")) {
            this.keysPressed[event.code] = true;
    
            this.gameInstance.players.forEach(player => {
                if (this.gameInstance.isGameOver || this.gameInstance.gameScreen.gameOverDisplayed) {
                    event.preventDefault();
                    return;
                }

                if ((event.code === "KeyS" && player === this.gameInstance.players[0] && !player.isFalling) ||
                    (event.code === "Space" && player === this.gameInstance.players[1] && !player.isFalling) ||
                    (event.code === "KeyB" && player === this.gameInstance.players[2] && !player.isFalling)) {
                        player.flap();
                }
            });
    
            if (event.code === 'Enter' && !this.gameInstance.isGameStarted) {
                this.gameInstance.isGameStarted = true;
                this.gameInstance.startGame();
            }
        }
    }

    handleKeyUp(event) {
        if (event.code === "Space" || event.code === "KeyS" || event.code === "KeyB") {
            this.keysPressed[event.code] = false;
        }
    }
}

export default GameKeyHandler;