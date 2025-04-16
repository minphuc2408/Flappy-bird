class GameConstructor {
    constructor(game) {
        this.game = game;
        
        //Src image
        this.game.spaceShip2Image = new Image();
        this.game.spaceShip2Image.src = "assets/imgs/spaceship2.png";

        this.game.spaceShip1Image = new Image();
        this.game.spaceShip1Image.src = "assets/imgs/spaceship1.png";
        
        this.game.spaceShip3Image = new Image();
        this.game.spaceShip3Image.src = "assets/imgs/spaceship3.png";

        this.game.spaceBackground = new Image();
        this.game.spaceBackground.src = "assets/imgs/gameCanvas.png";

        this.game.ufoBossImage = new Image();
        this.game.ufoBossImage.src = 'assets/imgs/ufoBoss.png';
        
        this.game.ufoComeImage = new Image();
        this.game.ufoComeImage.src = 'assets/imgs/ufo-come.png';

        this.game.asteroidImage = new Image();
        this.game.asteroidImage.src = 'assets/imgs/asteroid.png';
        
        this.game.missileImage = new Image();
        this.game.missileImage.src = 'assets/imgs/missile.png';

        this.game.blackHoleImage = new Image();
        this.game.blackHoleImage.src = 'assets/imgs/black-hole.png';

        this.game.cosmicDustImage = new Image();
        this.game.cosmicDustImage.src = 'assets/imgs/cosmic-dust.png';

        this.game.neptuneImage = new Image();
        this.game.neptuneImage.src = 'assets/imgs/neptune.png';

        this.game.uranusImage = new Image();
        this.game.uranusImage.src = 'assets/imgs/uranus.png';

        this.game.saturnImage = new Image();
        this.game.saturnImage.src = 'assets/imgs/saturn.png';

        this.game.marsImage = new Image();
        this.game.marsImage.src = 'assets/imgs/mars.png';

        this.game.mercuryImage = new Image();
        this.game.mercuryImage.src = 'assets/imgs/mercury.png';

        this.game.jupiterImage = new Image();
        this.game.jupiterImage.src = 'assets/imgs/jupiter.png';

        this.game.venusImage = new Image();
        this.game.venusImage.src = 'assets/imgs/venus.png';

        this.game.healthImage = new Image();
        this.game.healthImage.src = 'assets/imgs/health.png';

        this.game.shieldImage = new Image();
        this.game.shieldImage.src = 'assets/imgs/shield.png';

        this.game.powerImage = new Image();
        this.game.powerImage.src = 'assets/imgs/power.png';

        this.game.extraImage = new Image();
        this.game.extraImage.src = 'assets/imgs/extra.png';

        this.game.miniImage = new Image();
        this.game.miniImage.src = 'assets/imgs/mini.png';

        this.game.fireImage = new Image();
        this.game.fireImage.src = 'assets/imgs/fire.png';

        this.game.snowImage = new Image();
        this.game.snowImage.src = 'assets/imgs/snow.png';

        this.game.letterA = new Image();
        this.game.letterA.src = "assets/imgs/A.png"

        this.game.letterB = new Image();
        this.game.letterB.src = "assets/imgs/B.png"

        this.game.letterC = new Image();
        this.game.letterC.src = "assets/imgs/C.png"

        this.game.letterD = new Image();
        this.game.letterD.src = "assets/imgs/D.png"

        this.game.letterE = new Image();
        this.game.letterE.src = "assets/imgs/E.png"

        this.game.letterF = new Image();
        this.game.letterF.src = "assets/imgs/F.png"

        this.game.letterG = new Image();
        this.game.letterG.src = "assets/imgs/G.png"

        this.game.letterH = new Image();
        this.game.letterH.src = "assets/imgs/H.png"

        this.game.letterI = new Image();
        this.game.letterI.src = "assets/imgs/I.png"

        this.game.letterJ = new Image();
        this.game.letterJ.src = "assets/imgs/J.png"

        this.game.letterK = new Image();
        this.game.letterK.src = "assets/imgs/K.png"

        this.game.letterL = new Image();
        this.game.letterL.src = "assets/imgs/L.png"

        this.game.letterM = new Image();
        this.game.letterM.src = "assets/imgs/M.png"

        this.game.letterN = new Image();
        this.game.letterN.src = "assets/imgs/N.png"

        this.game.letterO = new Image();
        this.game.letterO.src = "assets/imgs/O.png"

        this.game.letterP = new Image();
        this.game.letterP.src = "assets/imgs/P.png"

        this.game.letterQ = new Image();
        this.game.letterQ.src = "assets/imgs/Q.png"

        this.game.letterR = new Image();
        this.game.letterR.src = "assets/imgs/R.png"

        this.game.letterS = new Image();
        this.game.letterS.src = "assets/imgs/S.png"

        this.game.letterT = new Image();
        this.game.letterT.src = "assets/imgs/T.png"

        this.game.letterU = new Image();
        this.game.letterU.src = "assets/imgs/U.png"

        this.game.letterV = new Image();
        this.game.letterV.src = "assets/imgs/V.png"

        this.game.letterW = new Image();
        this.game.letterW.src = "assets/imgs/W.png"

        this.game.letterX = new Image();
        this.game.letterX.src = "assets/imgs/X.png"

        this.game.letterY = new Image();
        this.game.letterY.src = "assets/imgs/Y.png"

        this.game.letterZ = new Image();
        this.game.letterZ.src = "assets/imgs/Z.png"

        this.game.number0 = new Image();
        this.game.number0.src = "assets/imgs/number-0.png"

        this.game.number1 = new Image();
        this.game.number1.src = "assets/imgs/number-1.png"

        this.game.number2 = new Image();
        this.game.number2.src = "assets/imgs/number-2.png"

        this.game.number3 = new Image();
        this.game.number3.src = "assets/imgs/number-3.png"

        this.game.number4 = new Image();
        this.game.number4.src = "assets/imgs/number-4.png"

        this.game.number5 = new Image();
        this.game.number5.src = "assets/imgs/number-5.png"

        this.game.number6 = new Image();
        this.game.number6.src = "assets/imgs/number-6.png"

        this.game.number7 = new Image();
        this.game.number7.src = "assets/imgs/number-7.png"

        this.game.number8 = new Image();
        this.game.number8.src = "assets/imgs/number-8.png"

        this.game.number9 = new Image();
        this.game.number9.src = "assets/imgs/number-9.png"

        this.game.multiplyImage = new Image();
        this.game.multiplyImage.src = "assets/imgs/multiply.png";

        this.game.equalImage = new Image();
        this.game.equalImage.src = "assets/imgs/=.png";
    }
}

export default GameConstructor;