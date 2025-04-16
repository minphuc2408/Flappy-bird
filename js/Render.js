class Render {
    constructor(game, gameCtx, gameCanvas) {
        this.game = game;
        this.gameCtx = gameCtx;
        this.gameCanvas = gameCanvas;
    }

    render(deltaTime) {
        // Continue the game render
        this.game.render(deltaTime);

        // Draw tutorial mode feedback and countdown
        if (this.game.isTutorialMode) {
            this.gameCtx.save();
            
            // Display tutorial mode information
            this.gameCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.gameCtx.font = 'bold 24px Ubuntu';
            this.gameCtx.textAlign = 'center';
            
            // Show remaining tutorial time
            const timeLeft = Math.max(0, Math.ceil(this.game.tutorialDuration - this.game.currentTime));
            this.gameCtx.fillText(`Tutorial Mode: ${timeLeft} seconds left`, this.gameCanvas.width / 2, this.gameCanvas.height - 50);
            this.gameCtx.fillText(`You are immortal during tutorial`, this.gameCanvas.width / 2, this.gameCanvas.height - 80);
            this.gameCtx.fillText(`The score still counts`, this.gameCanvas.width / 2, this.gameCanvas.height - 110);
            
            // If counting down, show the countdown with improved visibility
            if (this.game.isCountingDown) {
                // Semi-transparent overlay for better visibility
                this.gameCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                this.gameCtx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
                
                // Large countdown number
                this.gameCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                this.gameCtx.font = 'bold 100px Ubuntu';
                this.gameCtx.fillText(`${this.game.countdownTime}`, this.gameCanvas.width / 2, this.gameCanvas.height / 2);
                
                // Add text above the countdown
                this.gameCtx.fillStyle = 'white';
                this.gameCtx.font = 'bold 30px Ubuntu';
                this.gameCtx.fillText('GET READY!', this.gameCanvas.width / 2, this.gameCanvas.height / 2 - 150);
                
                if (this.game.countdownTime === 0) {
                    // Show START! text
                    this.gameCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    this.gameCtx.font = 'bold 80px Ubuntu';
                    this.gameCtx.fillText('START!', this.gameCanvas.width / 2, this.gameCanvas.height / 2 + 150);
                    
                    // Add explanation that tutorial is over
                    this.gameCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    this.gameCtx.font = 'bold 24px Ubuntu';
                    this.gameCtx.fillText('Tutorial over - Real game begins!', this.gameCanvas.width / 2, this.gameCanvas.height / 2 + 180);
                }
            }
            this.gameCtx.restore();
        }
    }
}

export default Render;