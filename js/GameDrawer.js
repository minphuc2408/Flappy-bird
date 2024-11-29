class GameDrawer {
    constructor(game, gameCtx) {
        this.game = game;
        this.gameCtx = gameCtx;
    }

    draw() {
        const obstacleHandler = this.game.obstacleHandler;
        const gameTime = this.game.getCurrentGameTime();
        
        this.gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        this.gameCtx.drawImage(this.game.spaceBackground, 0, 0, gameCanvas.width, gameCanvas.height);
        
        //draw Time 
        this.gameCtx.fillStyle = "#fff";
        this.gameCtx.fillText(`Time: `+ gameTime.toFixed(2) + "s", gameCanvas.width - 60, 30);
        let gap = 0;
        this.game.players.forEach((player) => {
            player.drawPlayer(gap + 15, 60, gap + 50, 30);
            gap += 250;
        });
        obstacleHandler.draw();
        this.game.boss.draw();
        this.game.smallBoss.forEach(smallBoss => {
            smallBoss.draw();
        });
    }
}

export default GameDrawer;