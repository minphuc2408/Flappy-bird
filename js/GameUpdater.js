class GameUpdate {
    constructor(game) {
        this.game = game;
    }

    update() {
        const currentTime = performance.now();
        const deltaTime = this.game.time.getDeltaTime();
        const gameTime = this.game.getCurrentGameTime();

        this.game.drawGame();
        
        if (!this.game.isGameStarted) {
            return;
        }
        
        this.game.time.update(currentTime);
        
        if (deltaTime === 0) {
            requestAnimationFrame(() => this.update());
            return;
        }
        
        //Player
        this.game.boss.update(gameTime);
        if(this.game.boss.x >= gameCanvas.width) {
            this.game.boss.reset();
        }
        this.game.playerInGame.forEach(player => {
            console.log(player.currentHealth);
            player.updatePlayer();
        });

        this.game.playerInGame = this.game.playerInGame.filter(player => player.isAlive);

        if(this.game.playerInGame.length === 0) {
            this.game.isGameOver = true;
            this.game.players.forEach(player => {
                player.resetPlayer();
            });
            this.game.playerInGame = [...this.game.players];
        }
        this.game.obstacleHandler.update(gameTime, deltaTime);

        this.game.smallBoss.forEach(smallBoss => {
            smallBoss.update(gameTime);
        });


        // GameOver
        if (this.game.isGameOver) {
            this.game.gameScreen.drawGameOverScreen(); 
            return;
        }

        requestAnimationFrame(() => this.update());
    }
}

export default GameUpdate;