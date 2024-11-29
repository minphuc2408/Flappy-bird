class GameReset {
    constructor(game) {
        this.game = game;
    }

    reset() {
        this.game.spacePressed = false;

        

        // Game
        this.game.scoreOverall = 0;
        this.game.scorePlayers = [];
        this.game.isGameStarted = false;
        this.game.isGameOver = false;
        this.game.obstacleInterval = 1;
        this.game.framesSinceLastObstacle = 0; 

        //Obtacles
        this.game.obstacleHandler.reset();
        this.game.boss.reset();

    }
}

export default GameReset;
