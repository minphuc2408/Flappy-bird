import {shakeScreen} from "./gameEffects.js"

class ObstacleHandler {
    constructor(game, gameCtx) {
        this.game = game;
        this.gameCtx = gameCtx;
        
        this.obstaclePositions = [];
        this.obstacles = [];
        this.obstacleWidth = 60;
        this.obstacleHeight = 60;
        this.obstaclesInterval = 1;
        this.obstacleGap = 150;
        this.framesSinceLastObstacle = 0;
        this.obstacleCount = 2;

        this.timeUpdateRandom = 0;
        this.weightRandom = 1;

        this.asteroids = [];
        this.lastAsteroidTime = 0;
        this.asteroidInterval = 20;
        this.missiles = [];
        this.lastMissileTime = 0;
        this.missileInterval = 15;

        this.weightedObstacleTypes = [
            { type: 'cosmicDust', image: this.game.cosmicDustImage, weight: 6 },
            { type: 'neptune', image: this.game.neptuneImage, weight: 10 },
            { type: 'uranus', image: this.game.uranusImage, weight: 10 },
            { type: 'saturn', image: this.game.saturnImage, weight: 10 },
            { type: 'mars', image: this.game.marsImage, weight: 10 },
            { type: 'mercury', image: this.game.mercuryImage, weight: 10 },
            { type: 'jupiter', image: this.game.jupiterImage, weight: 10 },
            { type: 'venus', image: this.game.venusImage, weight: 10 },
            { type: 'blackhole', image: this.game.blackHoleImage, weight: 4 },
            { type: 'shield', image: this.game.shieldImage, weight: 5 },
            { type: 'health', image: this.game.healthImage, weight: 5 },
            { type: 'power', image: this.game.powerImage, weight: 10 },
        ];
        this.math = [
            {type: "multiply", image: this.game.multiplyImage},
            {type: "equal", image: this.game.equalImage}
        ];
        this.alphabetAndNumber = [
            {type: "0", image: this.game.number0, weight: this.weightRandom},
            {type: "1", image: this.game.number1, weight: this.weightRandom},
            {type: "2", image: this.game.number2, weight: this.weightRandom},
            {type: "3", image: this.game.number3, weight: this.weightRandom},
            {type: "4", image: this.game.number4, weight: this.weightRandom},
            {type: "5", image: this.game.number5, weight: this.weightRandom},
            {type: "6", image: this.game.number6, weight: this.weightRandom},
            {type: "7", image: this.game.number7, weight: this.weightRandom},
            {type: "8", image: this.game.number8, weight: this.weightRandom},
            {type: "9", image: this.game.number9, weight: this.weightRandom},
            {type: "A", image: this.game.letterA, weight: this.weightRandom},
            {type: "B", image: this.game.letterB, weight: this.weightRandom},
            {type: "C", image: this.game.letterC, weight: this.weightRandom},
            {type: "D", image: this.game.letterD, weight: this.weightRandom},
            {type: "E", image: this.game.letterE, weight: this.weightRandom},
            {type: "F", image: this.game.letterF, weight: this.weightRandom},
            {type: "G", image: this.game.letterG, weight: this.weightRandom},
            {type: "H", image: this.game.letterH, weight: this.weightRandom},
            {type: "I", image: this.game.letterI, weight: this.weightRandom},
            {type: "J", image: this.game.letterJ, weight: this.weightRandom},
            {type: "K", image: this.game.letterK, weight: this.weightRandom},
            {type: "L", image: this.game.letterL, weight: this.weightRandom},
            {type: "M", image: this.game.letterM, weight: this.weightRandom},
            {type: "N", image: this.game.letterN, weight: this.weightRandom},
            {type: "O", image: this.game.letterO, weight: this.weightRandom},
            {type: "P", image: this.game.letterP, weight: this.weightRandom},
            {type: "Q", image: this.game.letterQ, weight: this.weightRandom},
            {type: "R", image: this.game.letterR, weight: this.weightRandom},
            {type: "S", image: this.game.letterS, weight: this.weightRandom},
            {type: "T", image: this.game.letterT, weight: this.weightRandom},
            {type: "U", image: this.game.letterU, weight: this.weightRandom},
            {type: "V", image: this.game.letterV, weight: this.weightRandom},
            {type: "W", image: this.game.letterW, weight: this.weightRandom},
            {type: "X", image: this.game.letterX, weight: this.weightRandom},
            {type: "Y", image: this.game.letterY, weight: this.weightRandom},
            {type: "Z", image: this.game.letterZ, weight: this.weightRandom}];
    }

    reset(){
        this.obstacles = [];
        this.obstaclesInterval = 1;
        this.framesSinceLastObstacle = 0;
        this.asteroids = [];
        this.lastAsteroidTime = 0;
        this.missiles = [];
        this.lastMissileTime = 0;
        this.pickRandomAlphabetArray = [];
        this.obstaclePositions = [];
    }

    checkCollision(player, obstacle) {
        return player.x + player.width > obstacle.x && player.x < obstacle.x + obstacle.width &&
        player.y + player.height > obstacle.y && player.y < obstacle.y + obstacle.height;
    }

    checkLaser(player, obstacle) {
        return player.x + player.width > obstacle.x && player.x < obstacle.x + obstacle.width &&
        player.y + player.height > obstacle.y && player.y < obstacle.y + obstacle.height;

    }

    updatePosition(obstacles, deltaTime) {
        obstacles.forEach((obstacle) => {
            obstacle.x += obstacle.speed * obstacle.direction * deltaTime;
        });
    }
    
    updateObstacles(gameTime, deltaTime) {
        this.updatePosition(this.obstacles, deltaTime);
        this.game.playerInGame.forEach((player) => {
            this.obstacles.forEach((obstacle, index) => {
                if (this.checkCollision(player, obstacle)) {
                    this.handleCollision(player, obstacle);
                    this.obstacles.splice(index, 1);
                } else if (this.checkLaser(player.largeLaser, obstacle) && player.checkShoot) {
                    this.obstacles.splice(index, 1);
                }
                
                if (obstacle.isColumn && obstacle.x + obstacle.width < player.x && !obstacle.passed) {
                   this.game.scoreOverall++;
                    obstacle.passed = true;
                }
    
                if (obstacle.x + obstacle.width < 0) {
                    this.obstacles.splice(index, 1);
                }
            });
        });
    }
    
    handleCollision(player, obstacle) {
        if (player.shieldActive) {
            this.handleShieldCollision(player, obstacle);
        } else {
            this.handleDirectCollision(player, obstacle);
        }
    }
    
    handleShieldCollision(player, obstacle) {
        switch (obstacle.type) {
            case 'cosmicDust':
            case 'neptune':
            case 'uranus':
            case 'saturn':
            case 'mars':
            case 'mercury':
            case 'jupiter':
            case 'venus':
                this.game.playSound(this.game.collisionSound);
                player.shieldActive = false;
                break;
            case 'blackhole':
                this.game.playSound(this.game.playerDieSound);
                player.shieldActive = false;
                player.currentHealth = 0;
                break;
            case 'shield': 
                this.game.playSound(this.game.collectSound);
                player.shieldActive = true;
                break;
            case 'health':
                this.game.playSound(this.game.collectSound);
                player.shieldActive = true;
                player.currentHealth = Math.min(player.maxHealth, player.currentHealth + 100);
                player.displayHealth = player.currentHealth;
                break;
            case 'power':
                this.game.playSound(this.game.collectSound);
                player.shieldActive = true;
                player.currentMana = Math.min(player.maxMana, player.currentMana + 200);
                player.displayMana = player.currentMana;
                break;
            }
    }
    
    handleDirectCollision(player, obstacle) {
        let damage = 0;
        switch (obstacle.type) {
            case 'cosmicDust':
            case 'neptune':
            case 'uranus':
            case 'saturn':
            case 'mars':
            case 'mercury':
            case 'jupiter':
            case 'venus':
                this.game.playSound(this.game.collisionSound);
                damage = 100;
                player.currentHealth -= damage;
                shakeScreen(500);
                break;
            case 'blackhole':
                this.game.playSound(this.game.playerDieSound);
                player.currentHealth = 0;
                break;
            case 'health':
                this.game.playSound(this.game.collectSound);
                player.currentHealth = Math.min(player.maxHealth, player.currentHealth + 100);
                player.displayHealth = player.currentHealth;
                break;
            case 'shield':
                this.game.playSound(this.game.collectSound);
                player.shieldActive = true;
                break;
            case 'power':
                this.game.playSound(this.game.collectSound);
                player.currentMana = Math.min(player.maxMana, player.currentMana + 100);
                player.displayMana = player.currentMana;
                break;
        }
    }

    updateMovingObstacles(obstacles, deltaTime, type) { //1 bug 3 days
        this.updatePosition(obstacles, deltaTime);
    
        this.game.playerInGame.forEach((player) => {
            obstacles.forEach((obstacle, index) => {
                if (this.checkCollision(player, obstacle)) {
                    if (player.shieldActive) {
                        player.shieldActive = false;
                    } else {
                        shakeScreen(500);
                        player.currentHealth -= 200;
                    }
                    obstacles.splice(index, 1);   
                }
                switch (type) {
                    case 'asteroid':
                        if (obstacle.x + obstacle.width < 0) {
                            obstacles.splice(index, 1);
                        }
                        break;
                    case 'missile':
                        if (obstacle.x + obstacle.width > gameCanvas.width) {
                            obstacles.splice(index, 1);
                        }
                        break;
                }
            });
        });
    }

    drawObstacles() {
        this.obstacles.forEach((obstacle) => {
            this.gameCtx.save();
            this.gameCtx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            this.gameCtx.restore();
        });
    }

    drawMovingObstacles() {
        const draw = (obstacles, isMissile) => {
            obstacles.forEach((obstacle) => {
                this.gameCtx.save();
                if(isMissile) {
                    this.gameCtx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
                    this.gameCtx.rotate(Math.PI / 4);
                    this.gameCtx.drawImage(obstacle.image, - obstacle.width / 2, - obstacle.height / 2, obstacle.width, obstacle.height);                
                } else {
                    this.gameCtx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);                
                }
                this.gameCtx.restore();
            });
        }
        draw(this.asteroids, false);
        draw(this.missiles, true);
    }

    createRandomObstacleColumn(gameTime) {
        //Position Obstacle
        const getRandomYPosition =  (obstaclePositions, minGap, canvasHeight) => {
            let obstacleY;
            let isValidPosition = false;
            const maxAttemps = 10;
            let attemps = 0;

            while(!isValidPosition && (attemps < maxAttemps)) {
                obstacleY = Math.floor(Math.random() * (canvasHeight - this.obstacleHeight));
                isValidPosition = obstaclePositions.every((pos) => Math.abs(pos - obstacleY) >= minGap);
                attemps++;
            }

            return isValidPosition ? obstacleY : null;
        }

        for (let i = 0; i < this.obstacleCount; i++) {
            const obstacleY = getRandomYPosition(this.obstaclePositions, this.obstacleGap + this.obstacleHeight, gameCanvas.height);
            if (obstacleY !== null) {
                this.obstaclePositions.push(obstacleY);
            }
        }
    }

    pushObstacle() {
        this.createRandomObstacleColumn();
        for (let i = 0; i <= this.obstaclePositions.length; i++) {
            const randomType = this.getRandomObstacleType(this.weightedObstacleTypes);
            this.obstacles.push({
                x: gameCanvas.width,
                y: this.obstaclePositions[i],
                width: this.obstacleWidth,
                height: this.obstacleHeight,
                type: randomType.type,
                image: randomType.image,
                isColumn: i === this.obstaclePositions.length,
                passed: false,
                direction: - 1,
                speed: 288
            });
        }
        this.obstaclePositions = [];
    }

    getRandomObstacleType (weightedTypes) {
        const totalWeight = weightedTypes.reduce((total, item) => total + item.weight, 0);
        const randomWeight = Math.random() * totalWeight;

        let cumulativeWeight = 0;
        for (const item of weightedTypes) {
            cumulativeWeight += item.weight;
            if (randomWeight < cumulativeWeight) {
                return item;
            }
        }
    };

    createRandomMovingObstacles(gameTime) {
        const getRandomMovingObstacles = (obstacles, obstacleType) => {
            let obstacleY;
            let isValidPosition = false;
            const maxAttemps = 50;
            let attemps = 0;
    
            while (!isValidPosition && attemps < maxAttemps) { //1 bug fix 2days
                obstacleY = Math.floor(Math.random() * (gameCanvas.height - this.obstacleHeight));
                isValidPosition = true;
                
                for (let obstacle of obstacles) {
                    if (Math.abs(obstacleY - obstacle.y) < this.obstacleHeight * 2.5) {
                        isValidPosition = false;
                        break;
                    }
                }
                attemps++;
            }
            if(isValidPosition) {
                switch (obstacleType) {
                    case 'asteroid': 
                        obstacles.push({
                            x: gameCanvas.width,
                            y: obstacleY,
                            width: this.obstacleWidth,
                            height: this.obstacleHeight,
                            speed: 720 + 144,
                            type: 'asteroid',
                            image: this.game.asteroidImage,
                            direction: -1,    
                        });
                        break;
                    case 'missile': 
                        this.createRandomMissileWarning(obstacleY);
                        obstacles.push({
                            x: - gameCanvas.width * 1.25,
                            y: obstacleY,
                            width: this.obstacleWidth,
                            height: this.obstacleHeight,
                            speed: 720 + 144,
                            type: 'missile',
                            image: this.game.missileImage,
                            direction: 1,    
                        });
                        break;
                }
            }
        };
        let asteroidCount = Math.floor(Math.random() * 3 + 1);
        let missileCount = Math.floor(Math.random() * 2 + 3);
        if(gameTime - this.lastAsteroidTime >= this.asteroidInterval) {
            for (let i = 0; i < asteroidCount; i++) {
                getRandomMovingObstacles(this.asteroids, 'asteroid');
            }
            this.lastAsteroidTime = gameTime;
        }
        if(gameTime - this.lastMissileTime >= this.missileInterval) {
            for(let i = 0; i < missileCount; i++) {
                getRandomMovingObstacles(this.missiles, 'missile');
            }
            this.lastMissileTime = gameTime;
        }
    }

    createRandomMissileWarning(missileY) {
        const warningElement = document.createElement('div');
        warningElement.classList.add('missile-warning');
        warningElement.innerHTML = 'Missle Incoming!';
        const canvasRect = gameCanvas.getBoundingClientRect();
        let warningTop = canvasRect.top + missileY + this.obstacleHeight / 2;
        const warningLeft = canvasRect.left + 30;
        warningElement.style.top = `${warningTop}px`;
        warningElement.style.left = `${warningLeft}px`;
        document.body.appendChild(warningElement);

        setTimeout(() => {
            document.body.removeChild(warningElement);
        }, 2000);
    }
}

class ObstacleNumberAndAlphabet extends ObstacleHandler {
    constructor(game, gameCtx) {
        super(game, gameCtx); 
        this.width = 120;
        this.height = 120;
        this.obstacleWidth = 76;
        this.obstacleHeight = 76;

        this.wrongSound = document.getElementById("wrong");  
        this.correctSound = document.getElementById("correct");  
    }

    playSound(type) {
        type.currentTime = 0;
        type.play();
    }
  
    updateObstacles(gameTime, deltaTime) {
        this.updatePickRandom();
        this.updatePosition(this.obstacles, deltaTime);
        this.increase();

        this.game.playerInGame.forEach((player) => {
            this.obstacles.forEach((obstacle, index) => {
                if (this.checkCollision(player, obstacle)) {
                    if (obstacle.type === this.pickRandomAlphabetArray[0].type) {
                            this.playSound(this.correctSound);
                            this.game.scoreOverall++;
                            this.pickRandomAlphabetArray.splice(0, 1);
                    } else {
                        this.playSound(this.wrongSound);
                        player.currentHealth -= 50;
                        shakeScreen(500);
                    }
                    this.obstacles.splice(index, 1);
                }

                if (obstacle.x + this.obstacleWidth < 0) {
                    this.obstacles.splice(index, 1);
                }
            });
        });
    }

    increase() {
        this.alphabetAndNumber.forEach((letterOrNumber, index) => {
            if(letterOrNumber.type == this.pickRandomAlphabetArray[0].type) {
                letterOrNumber.weight = 15;
            } else {
                letterOrNumber.weight = 1;
            }
        });
    }

    drawObstacles() {
        this.obstacles.forEach((obstacle) => {
            this.gameCtx.save();
            this.gameCtx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            this.gameCtx.restore();
        });
        this.drawPickRandom();
    }

    updatePickRandom() {
        if(this.pickRandomAlphabetArray.length < 1) this.pickRandomAlphabetArray.push(this.alphabetAndNumber[this.pickRandom()]);
    }

    drawPickRandom() {
        if(this.pickRandomAlphabetArray[0]){
            this.gameCtx.save();
            this.gameCtx.drawImage(
            this.pickRandomAlphabetArray[0].image, gameCanvas.width / 2 - this.height / 2, 20, this.width, this.height);
            this.gameCtx.restore();
        }
    }

    pickRandom() {
        return Math.floor(Math.random() * this.alphabetAndNumber.length);
    }


    pushObstacle() {
        this.createRandomObstacleColumn();
        for (let i = 0; i <= this.obstaclePositions.length; i++) {
            const randomType = this.getRandomObstacleType(this.alphabetAndNumber);
            const weight = (randomType.type === this.pickRandomAlphabetArray[0]?.type) ? 5 : randomType.weight;
            this.obstacles.push({
                x: gameCanvas.width,
                y: this.obstaclePositions[i],
                width: this.obstacleWidth,
                height: this.obstacleHeight,
                type: randomType.type,
                image: randomType.image,
                direction: -1,
                speed: 200,
                weight: weight
            });
        }
        this.obstaclePositions = [];
    }
}

class Enemy {
    constructor(game, ctx) {
        this.game = game;
        this.gameCtx = ctx;
        this.width = 90;
        this.height = 90;
        this.x = gameCanvas.width;
        this.y = gameCanvas.height / 2 - this.height / 2;
        this.speed = 36;
        this.isTimeActive = false;
        this.largeLaser = new LargeLaser(this, this.gameCtx);
        this.maxHealth;
        this.currentHealth = this.maxHealth;
        this.displayHealth = this.maxHealth;
        this.timeInterval = 60;
        this.timeStart = 32;
        this.timeEnd = 57
    }

    isColliding(player, type) {
        return player.x + player.width > type.x && player.x < type.x + type.width &&
        player.y + player.height > type.y && player.y < type.y + type.height;
    }

    checkCollisionLargeLaserOfPlayer() {
        this.game.playerInGame.forEach((player, index) => {
            if(this.isColliding(player.largeLaser, this) && player.checkShoot) {
                this.currentHealth -= 30;
            }
        });
    }

    updatePositionLargeLaser() {
        this.largeLaser.width = this.x + this.width / 2;
        this.largeLaser.y = this.y + this.height / 2 - this.largeLaser.height / 2;
    }

    isTime(gameTime) {
        return gameTime % this.timeInterval > this.timeStart && gameTime % this.timeInterval < this.timeEnd;
    }

    update(gameTime, deltaTime) {
        this.isTimeActive = this.isTime(gameTime);
        if (this.y < 0) {
            this.y = 0;
        }

        if(!this.isTimeActive && this.x < gameCanvas.width) {
            this.x += this.speed * deltaTime;
        }
    }
}

class BOSS extends Enemy {
    constructor(game, ctx) {
        super(game, ctx);
        this.image = this.game.ufoBossImage;
        this.speed = 120;
        this.targetY = this.y;
        this.direction = 1;

        this.lasers = [];
        this.fires = [];
        this.snows = [];

        this.currentTime = 0;
        this.smallLaserInterval = 1;
        this.maxLasers = 5;

        this.positionActive = null;
        this.angleSmallLaser = null;
        
    }

    createLasers(gameTime) {
        if (gameTime - this.currentTime >= this.smallLaserInterval) {
            this.currentTime = gameTime;
            this.game.playSound(this.game.shoot);
            for(let i = 1; i <= 1; i++) {
                const laser = new SmallLaser(this.game, this.gameCtx, this.x, this.y + this.height / 2, 0); 
                this.lasers.push(laser);
            }
        }
    }

    createLasersFan(gameTime) {
        if (gameTime - this.currentTime >= this.smallLaserInterval) {
            this.angleSmallLaser = -30;
            this.currentTime = gameTime;
            this.game.playSound(this.game.shoot);
            for(let i = 1; i <= this.maxLasers; i++) {
                const laser = new SmallLaser(this.game, this.gameCtx, this.x, this.y + this.height / 2, (Math.PI * this.angleSmallLaser) / 180); // 0 degrees
                this.lasers.push(laser);
                this.angleSmallLaser += 15;
            }
        }
    }

    updateSmallLaser(deltaTime) {
        this.lasers.forEach((laser, index) => {
            laser.update(deltaTime);    
            if(laser.x + laser.width < 0) {
                this.lasers.splice(index, 1);
            }
        });
    }

    updatePositionLargeLaser() {
        super.updatePositionLargeLaser();
        this.largeLaser.height = 20;
    }

    checkCollisionType(types, typeName) {
        this.game.playerInGame.forEach((player) => {
            types.forEach((type, index) => {
                if(this.isColliding(player, type)) {
                    if (player.shieldActive) {
                        player.shieldActive = false;
                        types.splice(index, 1);
                    } else {
                        switch (typeName) {
                            case "smallLaser": 
                                player.currentHealth -= 100;
                                break;
                            case "fire":
                                player.currentHealth -= 40;
                                break;
                            case "snow":
                                player.currentHealth -= 30;
                                break;
                        }
                        types.splice(index, 1);
                    }
                }
            });
        });
    }

    checkCollisionLargeLaser() {
            this.game.playerInGame.forEach((player) => {
                if(this.isColliding(player, this.largeLaser)) {
                    if (player.shieldActive) {
                        player.shieldActive = false;
                    } else {
                        player.currentHealth -= 10;
                    }
                }
            });
    }

    updatePositionX(gameTime, deltaTime) {
        this.positionActive = this.x <= gameCanvas.width * (4 / 6);
        if(this.isTimeActive && !this.positionActive) {
            this.x -= this.speed * deltaTime;
            return;
        }
    }

    updatePositionY (deltaTime) {
        if (Math.abs(this.y - this.targetY) <= 1) {
            this.targetY = Math.random() * (gameCanvas.height - this.height);
        }
        this.direction = this.targetY < this.y ? -1 : 1;              
        this.y += this.direction * this.speed * deltaTime;
        if (this.y + this.height > gameCanvas.height) {
            this.y = gameCanvas.height - this.height;
        } 
    }

    timeLargeLaser(gameTime) {
        if(this.timeLargeLaserActive(gameTime)) {
            this.updatePositionLargeLaser();
            this.checkCollisionLargeLaser();
            this.lasers = [];
        }
    }

    timeSmallLaser(gameTime) {
        if(this.timeSmallLaserActive(gameTime)) {
            this.createLasers(gameTime, this.angleSmallLaser);
        }
    }

    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);
        this.updatePositionX(gameTime, deltaTime);
    }

    draw(gameTime) {
        if(this.timeLargeLaserActive(gameTime)) {
            this.largeLaser.draw("gold", "#fff");
        }

        this.lasers.forEach((laser) => {
            laser.draw( "#ff1818", "#fff");
        });

        this.gameCtx.save();
        this.gameCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.gameCtx.restore();
    }

    drawHealth(healthX, healthY) {
        this.gameCtx.save();
        this.gameCtx.translate(gameCanvas.width, 0); 
        this.gameCtx.scale(-1, 1);
        this.gameCtx.drawImage(this.image, healthX - 30, healthY, 26, 26);
        this.gameCtx.fillStyle = "#333";
        this.gameCtx.fillRect(healthX, healthY, 200, 20);
        this.gameCtx.fillStyle = "rgba(255, 36, 33, 1)";
        this.gameCtx.fillRect(healthX, healthY, Math.max((this.displayHealth / this.maxHealth) * 200, 0), 20);
        this.gameCtx.translate(gameCanvas.width, 0); 
        this.gameCtx.scale(-1, 1);
        this.gameCtx.font = "12px Ubuntu";
        this.gameCtx.fillStyle = "#fff";
        this.gameCtx.fillText(`${Math.max(this.displayHealth, 0)} / ${this.maxHealth}`, gameCanvas.width - 130, healthY + 14);
        this.gameCtx.restore();
    }

    reset() {
        this.x = gameCanvas.width;
        this.y = gameCanvas.height / 2 - this.height / 2;
        this.targetY = this.y;
        this.direction = 1;
        this.lasers = [];
        this.fires = [];
        this.snows = [];
        this.currentTime = 0;
        this.positionActive = null;
        this.angleSmallLaser = null;
    }
}

class BOSSMEDIUM extends BOSS {
    constructor(game, ctx) {
        super(game, ctx);
    }

    timeLargeLaserActive(gameTime) {
        return gameTime % this.timeInterval > 45 && gameTime % this.timeInterval < 50;
    }

    timeSmallLaserActive(gameTime) {     
        return (gameTime % this.timeInterval > 35 && gameTime % this.timeInterval < 42) || (gameTime % this.timeInterval > 52 && gameTime % this.timeInterval < 57);    
    }

    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);

        if(this.positionActive) {
            this.updatePositionY(deltaTime);
            this.timeLargeLaser(gameTime);
            this.timeSmallLaser(gameTime)
            this.checkCollisionLargeLaserOfPlayer();
        }
        this.updateSmallLaser(deltaTime);
        this.checkCollisionType(this.lasers, "smallLaser");
    }
}

class BOSSHARD extends BOSS {
    constructor(game, ctx) {
        super(game, ctx);
        this.timeInterval = 90;
        this.timeStart = 32;
        this.timeEnd = 87;

        this.maxHealth = 50000;
        this.currentHealth = this.maxHealth;
        this.displayHealth = this.maxHealth;

        this.fireInterval = 1;
        this.fireTime = 0;
        this.snowInterval = 1.4;
        this.snowTime = 0;
    }

    updateFireAndSnow(deltaTime, types) {
        types.forEach((type, index) => {
            type.update(deltaTime);
            if(type.x + type.width < 0) {
                types.splice(index, 1);
            }
        });
    }

    timeLargeLaser(gameTime) {
        if(this.timeLargeLaserActive(gameTime)) {
            this.updatePositionLargeLaser();
            this.checkCollisionLargeLaser();
            this.lasers = [];
            this.fires = [];
            this.snows = []; 
        }
    }

    timeLargeLaserActive(gameTime) {
        return gameTime % this.timeInterval > 57 && gameTime % this.timeInterval < 65;
    }

    timeSmallLaserActive(gameTime) {     
        return (gameTime % this.timeInterval > 35 && gameTime % this.timeInterval < 45);    
    }

    timeSmallLaserFanActive(gameTime) {
        return gameTime % this.timeInterval > 47 && gameTime % this.timeInterval < 55;
    }

    timeFireAndSnowActive(gameTime) {
        return gameTime % this.timeInterval > 67 && gameTime % this.timeInterval < 85;
    }

    createFireFan(gameTime) {
        if (gameTime - this.fireTime >= this.fireInterval) {
            this.angleSmallLaser = -40;
            this.fireTime = gameTime;
            this.game.playSound(this.game.fireAndSnowSound);
            for(let i = 1; i <= this.maxLasers; i++) {
                const laser = new Fireball(this.game, this.gameCtx, this.x, this.y + this.height / 2, (Math.PI * this.angleSmallLaser) / 180); 
                this.fires.push(laser);
                this.angleSmallLaser += 20;
            }
        }
    }

    createSnowFan(gameTime) {
        if (gameTime - this.snowTime >= this.snowInterval) {
            this.angleSmallLaser = -50;
            this.snowTime = gameTime;
            this.game.playSound(this.game.fireAndSnowSound);
            for(let i = 1; i <= this.maxLasers; i++) {
                const laser = new SnowBall(this.game, this.gameCtx, this.x, this.y + this.height / 2, (Math.PI * this.angleSmallLaser) / 180); 
                this.snows.push(laser);
                this.angleSmallLaser += 25;
            }
        }
    }

    timeSmallLaserFan(gameTime) {
        if(this.timeSmallLaserFanActive(gameTime)) {
            this.createLasersFan(gameTime, this.angleSmallLaser);
        }
    }

    timeFire(gameTime) {
        if(this.timeFireAndSnowActive(gameTime)) {
            this.createFireFan(gameTime, this.angleSmallLaser);
        }
    }

    timeSnow(gameTime) {
        if(this.timeFireAndSnowActive(gameTime)) {
            this.createSnowFan(gameTime, this.angleSmallLaser);
        }
    }

    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);

        if(this.displayHealth > this.currentHealth) {
            this.displayHealth -= 50;
        } else {
            this.displayHealth = this.currentHealth;
        }

        if(this.currentHealth <= 0) {
            this.y += 200 * deltaTime;
            return;
        }

        if(this.positionActive) {
            this.updatePositionY(deltaTime);
            this.timeLargeLaser(gameTime);
            this.timeSmallLaser(gameTime);
            this.timeSmallLaserFan(gameTime);
            this.timeFire(gameTime);
            this.timeSnow(gameTime);
            this.checkCollisionLargeLaserOfPlayer();
        }
        this.updateFireAndSnow(deltaTime, this.fires);
        this.updateFireAndSnow(deltaTime, this.snows);
        this.updateSmallLaser(deltaTime);
        this.checkCollisionType(this.lasers, "smallLaser");
        this.checkCollisionType(this.fires, "fire");
        this.checkCollisionType(this.snows, "snow");
    }

    draw(gameTime, healthX, healthY) {
        super.draw(gameTime);
        this.fires.forEach((fire) => {
            fire.draw();
        });
        this.snows.forEach((snow) => {
            snow.draw();
        });
        if(this.isTimeActive) {
            this.drawHealth(healthX, healthY);
        }
    }

    reset() {
        super.reset();
        this.currentHealth = this.maxHealth;
    }
}

class BOSSSMALL extends Enemy {
    constructor(game, ctx, y) {
        super(game, ctx);
        this.image = this.game.ufoComeImage;
        this.speed = 90;
        this.y = y;

        this.maxHealth = 10000;
        this.currentHealth = this.maxHealth;
        this.displayHealth = this.maxHealth;
    }

    timeLargeLaserActive(gameTime) {
        return gameTime % this.game.boss[0].timeInterval >= 50 && gameTime % this.game.boss[0].timeInterval <= 55
        || gameTime % this.game.boss[0].timeInterval >= 65 && gameTime % this.game.boss[0].timeInterval <= 69;
    }

    checkCollision() {
        this.game.playerInGame.forEach((player) => {
            if(this.isColliding(player, this.largeLaser)) {
                if (player.shieldActive) {
                    player.shieldActive = false;
                } else {
                    player.currentHealth -= 10;
                }
            }
        });
    }
    
    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);
        
        if(this.displayHealth > this.currentHealth) {
            this.displayHealth -= 50;
        } else {
            this.displayHealth = this.currentHealth;
        }
        
        if(this.currentHealth <= 0) {
            this.y += 200 * deltaTime;
            return;
        }

        const positionActive = this.x <= gameCanvas.width * (5 / 6);
        if(this.isTimeActive && !positionActive) {
            this.x -= this.speed * deltaTime;
            return;
        }

        if(positionActive) {
            if(this.timeLargeLaserActive(gameTime)) {
                this.updatePositionLargeLaser();   
                this.checkCollision();    
            }
            this.checkCollisionLargeLaserOfPlayer();
        }
    }

    draw(gameTime) {
        if(this.timeLargeLaserActive(gameTime)) {
            this.largeLaser.draw("red", "rgba(255, 105, 0, 1)");
        }

        this.gameCtx.save();
        this.gameCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.gameCtx.restore();
    }

    drawHealth(healthX, healthY, y) {
        this.gameCtx.save();
        this.gameCtx.translate(gameCanvas.width, 0); 
        this.gameCtx.scale(-1, 1);
        this.gameCtx.drawImage(this.image, healthX - 30, healthY, 20, 20);
        this.gameCtx.fillStyle = "rgba(255, 36, 33, 1)";
        this.gameCtx.fillRect(healthX, healthY, Math.max((this.displayHealth / this.maxHealth) * 140, 0), y);
        this.gameCtx.restore();
    }

    reset() {
        this.x = gameCanvas.width;
    }
}

class BOSSSMALLMEDIUM extends BOSSSMALL {
    constructor(game, ctx, y) {
        super(game, ctx);
    }
    
    timeLargeLaserActive(gameTime) {
        return gameTime % this.game.boss[0].timeInterval >= 45 && gameTime % this.game.boss[0].timeInterval <= 50
    }
}

class BOSSSMALLHARD extends BOSSSMALL {
    constructor(game, ctx, y) {
        super(game, ctx);

        this.timeInterval = 90;
        this.timeStart = 32;
        this.timeEnd = 87;
    }

    draw(gameTime, healthX, healthY, y) {
        super.draw(gameTime);
        if(this.isTimeActive) {
            this.drawHealth(healthX, healthY, y);
        }
    }

    reset() {
        super.reset();
        this.currentHealth = this.maxHealth;
    }
}

class Laser {
    constructor(game, ctx) {
        this.game = game;
        this.gameCtx = ctx;
        this.width = 10;
        this.height = 5;
        this.speed = 600;
        this.x =  gameCanvas.width;
        this.y;
    }
}

class SmallLaser extends Laser {
    constructor(game, ctx, x, y, angle) {
        super(game, ctx);
        this.x = x;
        this.y = y;
        this.width = 75;
        this.height = 14;
        this.angle = angle; 
    }

    update(deltaTime) {
        this.x -= Math.cos(this.angle) * this.speed * deltaTime;
        this.y -= Math.sin(this.angle) * this.speed * deltaTime;
    }

    draw(BorderColor, MainColor) {
        this.gameCtx.save();

        this.gameCtx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.gameCtx.rotate(this.angle);

        this.gameCtx.fillStyle = BorderColor;
        this.gameCtx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height * 0.2);

        this.gameCtx.fillStyle = MainColor;
        this.gameCtx.fillRect(-this.width / 2, -this.height / 2 + this.height * 0.2, this.width, this.height * 0.6);

        this.gameCtx.fillStyle = BorderColor;
        this.gameCtx.fillRect(-this.width / 2, -this.height / 2 + this.height * 0.8, this.width, this.height * 0.2);

        this.gameCtx.translate(this.x, this.y);

        this.gameCtx.restore();
    }
}

class Fireball extends SmallLaser {
    constructor(game, ctx, x, y, angle) {
        super(game, ctx, x, y, angle);
        this.width = 100;
        this.height = 60;
        this.image = this.game.fireImage;
    }
    
    draw() {
        this.gameCtx.save();
        this.gameCtx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.gameCtx.rotate(this.angle);
        this.gameCtx.drawImage(this.image, - this.width / 2, - this.height / 2, this.width / 2, this.height /2);
        this.gameCtx.translate(this.x, this.y);
        this.gameCtx.restore();
    }
}

class SnowBall extends SmallLaser {
    constructor(game, ctx, x, y, angle) {
        super(game, ctx, x, y, angle);
        this.width = 100;
        this.height = 60;
        this.image = this.game.snowImage;
    }

    draw() {
        this.gameCtx.save();
        this.gameCtx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.gameCtx.rotate(this.angle);
        this.gameCtx.drawImage(this.image, - this.width / 2, - this.height / 2, this.width / 2, this.height /2);
        this.gameCtx.translate(this.x, this.y);
        this.gameCtx.restore();
    }
}

class LargeLaser extends Laser {
    constructor(game, ctx) {  
        super(game, ctx);
        this.width = 0;
        this.height = 10;
        this.x = 0;
        this.y = 0;
    }

    draw(BorderColor, MainColor) {
        if(this.y <= this.height) {
            return;
        }
        
        this.gameCtx.save();
        this.gameCtx.fillStyle = BorderColor;
        this.gameCtx.fillRect(this.x, this.y, this.width, this.height * 0.2);
        this.gameCtx.fillStyle = MainColor;
        this.gameCtx.fillRect(this.x, this.y + this.height * 0.2, this.width, this.height * 0.6);
        this.gameCtx.fillStyle = BorderColor;
        this.gameCtx.fillRect(this.x, this.y + this.height * 0.8, this.width, this.height * 0.2);
        this.gameCtx.restore();
    }
}

export { BOSSMEDIUM, BOSSSMALL, ObstacleHandler, SmallLaser, LargeLaser, ObstacleNumberAndAlphabet, BOSSHARD, BOSSSMALLHARD, BOSSSMALLMEDIUM };

// Luu diem so nguoi choi
// Sua time