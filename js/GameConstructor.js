class GameConstructor {
    constructor(game) {
        this.game = game;

        //Key 
        this.game.spacePressed = false;
        
        //Game
        this.game.scoreOverall = 0;
        this.game.scorePlayers = [];
        this.game.isGameStarted = false;
        this.game.isGameOver = false;

        // Obstacle
        this.game.shieldActive = false;

        //Src image
        this.game.spaceShip2Image = new Image();
        this.game.spaceShip2Image.src = "./assets/img/spaceship2.png"

        this.game.spaceShip1Image = new Image();
        this.game.spaceShip1Image.src = "./assets/img/spaceship1.png";
        
        this.game.spaceShip3Image = new Image();
        this.game.spaceShip3Image.src = "./assets/img/spaceship3.png";

        this.game.spaceBackground = new Image();
        this.game.spaceBackground.src = "./assets/img/gameCanvas.png";

        this.game.ufoBossImage = new Image();
        this.game.ufoBossImage.src = './assets/img/ufoBoss.png';
        
        this.game.ufoComeImage = new Image();
        this.game.ufoComeImage.src = './assets/img/ufo-come.png';
        
        this.game.ufochild1Image = new Image();
        this.game.ufochild1Image.src = './assets/img/ufo-child-1.png';
        
        this.game.ufochild2Image = new Image();
        this.game.ufochild2Image.src = './assets/img/ufo-child-2.png';

        this.game.ufochild3Image = new Image();
        this.game.ufochild3Image.src = './assets/img/ufo-child-3.png';

        this.game.fireballImage = new Image();
        this.game.fireballImage.src = './assets/img/fireball.png';
        
        this.game.iceballImage = new Image();
        this.game.iceballImage.src = './assets/img/iceball.png';
        
        this.game.asteroidImage = new Image();
        this.game.asteroidImage.src = './assets/img/asteroid.png';
        
        this.game.missileImage = new Image();
        this.game.missileImage.src = './assets/img/missile.png';

        this.game.blackHoleImage = new Image();
        this.game.blackHoleImage.src = './assets/img/black-hole.png';

        this.game.cosmicDustImage = new Image();
        this.game.cosmicDustImage.src = './assets/img/cosmic-dust.png';

        this.game.neptuneImage = new Image();
        this.game.neptuneImage.src = './assets/img/neptune.png';

        this.game.uranusImage = new Image();
        this.game.uranusImage.src = './assets/img/uranus.png';

        this.game.saturnImage = new Image();
        this.game.saturnImage.src = './assets/img/saturn.png';

        this.game.marsImage = new Image();
        this.game.marsImage.src = './assets/img/mars.png';

        this.game.mercuryImage = new Image();
        this.game.mercuryImage.src = './assets/img/mercury.png';

        this.game.jupiterImage = new Image();
        this.game.jupiterImage.src = './assets/img/jupiter.png';

        this.game.venusImage = new Image();
        this.game.venusImage.src = './assets/img/venus.png';

        this.game.healthImage = new Image();
        this.game.healthImage.src = './assets/img/health.png';

        this.game.shieldImage = new Image();
        this.game.shieldImage.src = './assets/img/shield.png';
    }
}

export default GameConstructor;