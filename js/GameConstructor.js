class GameConstructor {
    constructor(game) {
        this.game = game;
        
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

        this.game.powerImage = new Image();
        this.game.powerImage.src = './assets/img/power.png';

        this.game.extraImage = new Image();
        this.game.extraImage.src = './assets/img/extra.png'

        this.game.miniImage = new Image();
        this.game.miniImage.src = './assets/img/mini.png'

        this.game.letterA = new Image();
        this.game.letterA.src = "./assets/img/A.png"

        this.game.letterB = new Image();
        this.game.letterB.src = "./assets/img/B.png"

        this.game.letterC = new Image();
        this.game.letterC.src = "./assets/img/C.png"

        this.game.letterD = new Image();
        this.game.letterD.src = "./assets/img/D.png"

        this.game.letterE = new Image();
        this.game.letterE.src = "./assets/img/E.png"

        this.game.letterF = new Image();
        this.game.letterF.src = "./assets/img/F.png"

        this.game.letterG = new Image();
        this.game.letterG.src = "./assets/img/G.png"

        this.game.letterH = new Image();
        this.game.letterH.src = "./assets/img/H.png"

        this.game.letterI = new Image();
        this.game.letterI.src = "./assets/img/I.png"

        this.game.letterJ = new Image();
        this.game.letterJ.src = "./assets/img/J.png"

        this.game.letterK = new Image();
        this.game.letterK.src = "./assets/img/K.png"

        this.game.letterL = new Image();
        this.game.letterL.src = "./assets/img/L.png"

        this.game.letterM = new Image();
        this.game.letterM.src = "./assets/img/M.png"

        this.game.letterN = new Image();
        this.game.letterN.src = "./assets/img/N.png"

        this.game.letterO = new Image();
        this.game.letterO.src = "./assets/img/O.png"

        this.game.letterP = new Image();
        this.game.letterP.src = "./assets/img/P.png"

        this.game.letterQ = new Image();
        this.game.letterQ.src = "./assets/img/Q.png"

        this.game.letterR = new Image();
        this.game.letterR.src = "./assets/img/R.png"

        this.game.letterS = new Image();
        this.game.letterS.src = "./assets/img/S.png"

        this.game.letterT = new Image();
        this.game.letterT.src = "./assets/img/T.png"

        this.game.letterU = new Image();
        this.game.letterU.src = "./assets/img/U.png"

        this.game.letterV = new Image();
        this.game.letterV.src = "./assets/img/V.png"

        this.game.letterW = new Image();
        this.game.letterW.src = "./assets/img/W.png"

        this.game.letterX = new Image();
        this.game.letterX.src = "./assets/img/X.png"

        this.game.letterY = new Image();
        this.game.letterY.src = "./assets/img/Y.png"

        this.game.letterZ = new Image();
        this.game.letterZ.src = "./assets/img/Z.png"

        this.game.number0 = new Image();
        this.game.number0.src = "./assets/img/number-0.png"

        this.game.number1 = new Image();
        this.game.number1.src = "./assets/img/number-1.png"

        this.game.number2 = new Image();
        this.game.number2.src = "./assets/img/number-2.png"

        this.game.number3 = new Image();
        this.game.number3.src = "./assets/img/number-3.png"

        this.game.number4 = new Image();
        this.game.number4.src = "./assets/img/number-4.png"

        this.game.number5 = new Image();
        this.game.number5.src = "./assets/img/number-5.png"

        this.game.number6 = new Image();
        this.game.number6.src = "./assets/img/number-6.png"

        this.game.number7 = new Image();
        this.game.number7.src = "./assets/img/number-7.png"

        this.game.number8 = new Image();
        this.game.number8.src = "./assets/img/number-8.png"

        this.game.number9 = new Image();
        this.game.number9.src = "./assets/img/number-9.png"



        // this.game.images = [
        //     this.game.spaceShip1Image,
        //     this.game.spaceShip2Image,
        //     this.game.spaceShip3Image,
        //     this.game.spaceBackground,
        //     this.game.ufoBossImage,
        //     this.game.ufoComeImage,
        //     this.game.asteroidImage,
        //     this.game.missileImage,
        //     this.game.blackHoleImage,
        //     this.game.cosmicDustImage,
        //     this.game.neptuneImage,
        //     this.game.uranusImage,
        //     this.game.saturnImage,
        //     this.game.marsImage,
        //     this.game.mercuryImage,
        //     this.game.jupiterImage,
        //     this.game.venusImage,
        //     this.game.healthImage,
        //     this.game.shieldImage,
        //     this.game.powerImage,
        //     this.game.letterA,
        //     this.game.letterB,
        //     this.game.letterC,
        //     this.game.letterD,
        //     this.game.letterE,
        //     this.game.letterF,
        //     this.game.letterG,
        //     this.game.letterH,
        //     this.game.letterI,
        //     this.game.letterJ,
        //     this.game.letterK,
        //     this.game.letterL,
        //     this.game.letterM,
        //     this.game.letterN,
        //     this.game.letterO,
        //     this.game.letterP,
        //     this.game.letterQ,
        //     this.game.letterR,
        //     this.game.letterS,
        //     this.game.letterT,
        //     this.game.letterU,
        //     this.game.letterV,
        //     this.game.letterW,
        //     this.game.letterX,
        //     this.game.letterY,
        //     this.game.letterZ,
        // ];
        // rgba(136, 216, 252, 1) #88D8FC #FFF5F7 #AFEEEE
        // rgba(140, 212, 252, 1) #8CD4FC
        // rgba(186, 168, 250, 1) #BAA8FA
        // rgba(215, 140, 249, 1) #D78CF9
        // rgba(226, 130, 249, 1) #E282F9

        this.game.LoadImage = false;
    }
}

export default GameConstructor;