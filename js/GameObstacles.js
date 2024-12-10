import {shakeScreen} from "./gameEffects.js"

const TIMEINTERVAL = 60;
const TIME_START = 32;
const TIME_END = 55;

class ObstacleHandler {
    constructor(game, gameCtx) {
        this.game = game;
        this.gameCtx = gameCtx;
        
        this.obstacles = [];
        this.obstacleWidth = 60;
        this.obstacleHeight = 60;
        this.obstaclesInterval = 1;
        this.obstacleGap = 150;
        this.framesSinceLastObstacle = 0;

        this.asteroids = [];
        this.lastAsteroidTime = 0;
        this.asteroidInterval = 10;
        this.missiles = [];
        this.lastMissileTime = 0;
        this.missileInterval = 10;
    }

    reset(){
        this.obstacles = [];
        this.obstaclesInterval = 1;
        this.framesSinceLastObstacle = 0;
        this.asteroids = [];
        this.lastAsteroidTime = 0;
        this.missiles = [];
        this.lastMissileTime = 0;
        this.iceballs = [];
        this.fireballs =[];
        this.isBurning = false;
        this.burnStartTime = null;
        this.lastBurnSecond = 0;
        this.isFreezing = false;
        this.freezeStartTime = null;    
        this.lastFreezeSecond = 0;
    }

    update(gameTime, deltaTime) {
        this.updateObstacles(deltaTime);
        this.updateMovingObstacles(this.asteroids, deltaTime, "asteroid");
        this.updateMovingObstacles(this.missiles, deltaTime, "missile");
        if(gameTime % TIMEINTERVAL <= 30) {
            this.framesSinceLastObstacle += deltaTime;
            this.createRandomMovingObstacles(gameTime);
            if(this.framesSinceLastObstacle >= this.obstaclesInterval) {
                this.createRandomObstacleColumn(gameTime);
                this.framesSinceLastObstacle = 0;
            }
        }
    }

    draw() {
        this.drawObstacles();
        this.drawMovingObstacles();
    }

    checkCollision(player, obstacle) {
        return player.x + player.width > obstacle.x && player.x < obstacle.x + this.obstacleWidth &&
        player.y + player.height > obstacle.y && player.y < obstacle.y + this.obstacleHeight;
    }

    updatePosition(obstacles, deltaTime) {
        obstacles.forEach((obstacle) => {
            obstacle.x += obstacle.speed * obstacle.direction * deltaTime;
        });
    }
    
    updateObstacles(deltaTime) {
        this.updatePosition(this.obstacles, deltaTime);
    
        this.game.playerInGame.forEach((player) => {
            this.obstacles.forEach((obstacle, index) => {
                if (this.checkCollision(player, obstacle)) {
                    this.handleCollision(player, obstacle);
                    this.obstacles.splice(index, 1);
                }
    
                if (obstacle.isColumn && obstacle.x + this.obstacleWidth < player.x && !obstacle.passed) {
                   this.game.scoreOverall++;
                    obstacle.passed = true;
                }
    
                if (obstacle.x + this.obstacleWidth < 0) {
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
            case 'ufo':
            case 'ufochild1':
            case 'ufochild2':
                player.shieldActive = false;
                break;
            case 'health':
                player.shieldActive = true;
                player.currentHealth = Math.min(player.maxHealth, player.currentHealth + 100);
                player.displayHealth = player.currentHealth;
                break;
            case 'power':
                player.shieldActive = true;
                player.currentMana = Math.min(player.maxMana, player.currentMana + 100);
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
                damage = 100;
                player.currentHealth -= damage;
                shakeScreen(500);
                break;
            case 'blackHole':
                player.currentHealth = 0;
                break;
            case 'health':
                player.currentHealth = Math.min(player.maxHealth, player.currentHealth + 100);
                player.displayHealth = player.currentHealth;
                break;
            case 'shield':
                player.shieldActive = true;
                break;
            case 'power':
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
                        if (obstacle.x + this.obstacleWidth < 0) {
                            obstacles.splice(index, 1);
                        }
                        break;
                    case 'missile':
                        if (obstacle.x + this.obstacleWidth > gameCanvas.width) {
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
            this.gameCtx.drawImage(obstacle.image, obstacle.x, obstacle.y, this.obstacleWidth, this.obstacleHeight);
            this.gameCtx.restore();
        });
    }

    drawMovingObstacles() {
        const draw = (obstacles, isMissile) => {
            obstacles.forEach((obstacle) => {
                this.gameCtx.save();
                if(isMissile) {
                    this.gameCtx.translate(obstacle.x + this.obstacleWidth / 2, obstacle.y + this.obstacleHeight / 2);
                    this.gameCtx.rotate(Math.PI / 4);
                    this.gameCtx.drawImage(obstacle.image, - this.obstacleWidth / 2, - this.obstacleHeight / 2, this.obstacleWidth, this.obstacleHeight);                
                } else {
                    this.gameCtx.drawImage(obstacle.image, obstacle.x, obstacle.y, this.obstacleWidth, this.obstacleHeight);                
                }
                this.gameCtx.restore();
            });
        }
        draw(this.asteroids, false);
        draw(this.missiles, true);
    }

    createRandomObstacleColumn(gameTime) {
        const weightedObstacleTypes = [
            { type: 'cosmicDust', image: this.game.cosmicDustImage, weight: 6 },
            { type: 'neptune', image: this.game.neptuneImage, weight: 10 },
            { type: 'uranus', image: this.game.uranusImage, weight: 10 },
            { type: 'saturn', image: this.game.saturnImage, weight: 10 },
            { type: 'mars', image: this.game.marsImage, weight: 10 },
            { type: 'mercury', image: this.game.mercuryImage, weight: 10 },
            { type: 'jupiter', image: this.game.jupiterImage, weight: 10 },
            { type: 'venus', image: this.game.venusImage, weight: 10 },
            { type: 'blackHole', image: this.game.blackHoleImage, weight: 4 },
            { type: 'shield', image: this.game.shieldImage, weight: 5 },
            { type: 'health', image: this.game.healthImage, weight: 5 },
            { type: 'power', image: this.game.powerImage, weight: 10 },
        ];

        //Position Obstacle
        const obstaclePositions = [];
        const obstacleCount = 4;
        const minGap = this.obstacleWidth + this.obstacleGap;
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

        for (let i = 0; i < obstacleCount; i++) {
            const obstacleY = getRandomYPosition(obstaclePositions, minGap, gameCanvas.height);
            if (obstacleY !== null) {
                obstaclePositions.push(obstacleY);
            }
        }

        // Get random obstale type
        const getRandomObstacleType = (weightedTypes) => {
            const totalWeight = weightedTypes.reduce((total, item) => total + item.weight, 0);
            const randomWeight = Math.random() * totalWeight;

            let cumalativeWeight = 0;
            for (const item of weightedTypes) {
                cumalativeWeight += item.weight;
                if (randomWeight < cumalativeWeight) {
                    return item;
                }
            }
        };

        for (let i = 0; i <= obstaclePositions.length; i++) {
            const randomType = getRandomObstacleType(weightedObstacleTypes);
                this.obstacles.push({
                    x: gameCanvas.width,
                    y: obstaclePositions[i],
                    type: randomType.type,
                    image: randomType.image,
                    isColumn: i === obstaclePositions.length,
                    passed: false,
                    direction: - 1,
                    speed: 288
                });
        }
    }

    createRandomMovingObstacles(gameTime) {
        const getRandomMovingObstacles = (obstacles, obstacleType) => {
            let obstacleY;
            let isValidPosition = false;
            const maxAttemps = 10;
            let attemps = 0;
    
            while (!isValidPosition && attemps < maxAttemps) { //1 bug fix 2days
                obstacleY = Math.floor(Math.random() * (gameCanvas.height - this.obstacleWidth));
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
    }

    isColliding(player, type) {
        return player.x + player.width > type.x && player.x < type.x + type.width &&
        player.y + player.height > type.y && player.y < type.y + type.height;
    }

    updatePositionLargeLaser() {
        this.largeLaser.width = this.x + this.width / 2;
        this.largeLaser.y = this.y + this.height / 2 - this.largeLaser.height / 2;
    }

    isTime(gameTime) {
        return gameTime % TIMEINTERVAL > TIME_START && gameTime % TIMEINTERVAL < TIME_END;
    }

    update(gameTime, deltaTime) {
        this.isTimeActive = this.isTime(gameTime);
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > gameCanvas.height) {
            this.y = gameCanvas.height - this.height;
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
        this.timeShoot = 0;
        this.lasers = [];
        this.currentTime = 0;
        this.smallLaserInterval = 0.6;
    }

    createSmallLaser() {
        const laser = new SmallLaser(this, this.gameCtx, this.x, this.y + this.height / 2);
        this.lasers.push(laser);
    }

    createLasers(gameTime) {
        if(gameTime - this.currentTime >= this.smallLaserInterval) {
            this.createSmallLaser(gameTime);
            this.currentTime = gameTime;
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

    timeLargeLaserActive(gameTime) {
        return gameTime % TIMEINTERVAL > 45 && gameTime % TIMEINTERVAL < 50;
    }

    timeSmallLaserActive(gameTime) {     
        return (gameTime % TIMEINTERVAL > 35 && gameTime % TIMEINTERVAL < 45) || (gameTime % TIMEINTERVAL > 50 && gameTime % TIMEINTERVAL < 57);    
    }

    checkCollisionSmallLaser() {
        this.game.playerInGame.forEach((player) => {
            this.lasers.forEach((smallLaser, index) => {
                if(this.isColliding(player, smallLaser)) {
                    if (player.shieldActive) {
                        player.shieldActive = false;
                        this.lasers.splice(index, 1);
                    } else {
                        player.currentHealth -= 100;
                        this.lasers.splice(index, 1);
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

    update(gameTime, deltaTime) {
        super.update(gameTime, deltaTime);

        const positionActive = this.x <= gameCanvas.width * (4 / 6);
        if(this.isTimeActive && !positionActive) {
            this.x -= this.speed * deltaTime;
            return;
        }

        if(positionActive) {
            if (Math.abs(this.y - this.targetY) <= 1) {
                this.targetY = Math.random() * (gameCanvas.height - this.height);
            }
            this.direction = this.targetY < this.y ? -1 : 1;               
            this.y += this.direction * this.speed * deltaTime;

            if(this.timeLargeLaserActive(gameTime)) {
                this.updatePositionLargeLaser();
                this.checkCollisionLargeLaser();
                this.lasers = [];
            }
            if(this.timeSmallLaserActive(gameTime)) {
                this.createLasers(gameTime);
                this.checkCollisionSmallLaser();
            }
        }
        this.updateSmallLaser(deltaTime);
    }

    draw(gameTime) {
        if(this.timeLargeLaserActive(gameTime)) {
            this.largeLaser.draw("gold", "#fff");
        }

        if(this.timeSmallLaserActive(gameTime)) {
            this.lasers.forEach((laser) => {
                laser.draw( "#ff1818", "#fff");
            });
        }
        this.gameCtx.save();
        this.gameCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.gameCtx.restore();
    }

    reset() {
        this.x = gameCanvas.width;
        this.y = gameCanvas.height / 2 - this.height / 2;
        this.targetY = this.y;
        this.direction = 1;
        this.lasers = [];
        this.currentTime = 0;
    }
}

class BOSSSMALL extends Enemy {
    constructor(game, ctx, y) {
        super(game, ctx);
        this.image = this.game.ufoComeImage;
        this.speed = 90;
        this.y = y;
    }

    timeLargeLaserActive(gameTime) {
        return gameTime % 60 >= 50 && gameTime % 60 <= 55;
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
        const positionActive = this.x >= gameCanvas.width * (5 / 6);
        if(this.isTimeActive && positionActive) {
            this.x -= this.speed * deltaTime;
            return;
        }

        if(this.timeLargeLaserActive(gameTime)) {
            this.updatePositionLargeLaser();   
            this.checkCollision();    
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

    reset() {
        this.x = gameCanvas.width;
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

    update(deltaTime) {
        this.x -= this.speed * deltaTime;
    }
}

class SmallLaser extends Laser {
    constructor(game, ctx, x, y) {
        super(game, ctx);
        this.x = x;
        this.y = y;
        this.width = 75;
        this.height = 14;
    }

    draw(BorderColor, MainColor) {
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

class LargeLaser extends Laser {
    constructor(game, ctx) {  
        super(game, ctx);
        this.width = 0;
        this.height = 10;
        this.x = 0;
        this.y = 0;
    }

    draw(BorderColor, MainColor) {
        if(this.y <= 0) {
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

export { BOSS, BOSSSMALL, ObstacleHandler, SmallLaser, LargeLaser };

// Tao logic de xuat hien smallLaser va largeLaser 
// Tai dung vi tri thi moi xuat hien smallLaser va largeLaser
// Check mau
