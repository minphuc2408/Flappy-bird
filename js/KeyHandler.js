class GameKeyHandler {
    constructor(game) {
        this.game = game;
        this.keysPressed = {};

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    handleKeyDown(event) {
        if (gameCanvas && !gameCanvas.classList.contains("visible")) {
            this.keysPressed[event.code] = true;
    
            this.game.players.forEach(player => {
                if (this.game.isGameOver || this.game.gameScreen.gameOverDisplayed) {
                    event.preventDefault();
                    return;
                }

                if ((event.code === "Space" && player === this.game.players[0] && player.currentHealth > 0) ||
                    (event.code === "KeyA" && player === this.game.players[1] && player.currentHealth > 0) ||
                    (event.code === "KeyL" && player === this.game.players[2] && player.currentHealth > 0)) {
                        player.flap();
                }
            });
    
            if (event.code === 'Enter' && !this.game.isGameStarted) {
                this.game.startTime = performance.now();  
                this.game.isGameStarted = true;
                this.game.render();
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