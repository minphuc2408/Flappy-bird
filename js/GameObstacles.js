class ObstacleHandler {
    constructor(game, gameCtx) {
        this.game = game;
        this.gameCtx = gameCtx;
        
        this.obstacles = [];
        this.obstacleWidth = 60;
        this.obstacleHeight = 60;
        this.obstaclesInterval = 0;
        this.obstacleGap = 150;

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
    }

    update(gameTime, deltaTime) {
        this.updateObstacles(deltaTime);
        this.asteroids = this.updateMovingObstacles(this.asteroids, deltaTime);
        this.missiles = this.updateMovingObstacles(this.missiles, deltaTime);
        this.framesSinceLastObstacle += deltaTime;
        if(this.framesSinceLastObstacle >= this.obstaclesInterval) {
            this.createRandomObstacleColumn(gameTime);
            this.framesSinceLastObstacle = 0;
        }
        this.createRandomMovingObstacles(gameTime);
    }

    draw() {
        this.drawObstacles();
        this.drawMovingObstacles();
    }

    updateX(obstacles, deltaTime) {
        obstacles.forEach((obstacle) => {
            obstacle.x += obstacle.speed * obstacle.direction * deltaTime;
        });
    }

    removeObstacles(obstacle) {
        return !(obstacle.x + this.obstacleWidth <= 0 || obstacle.x > gameCanvas.width);
    }

    updateObstacles(deltaTime) {
        this.updateX(this.obstacles, deltaTime);

        this.game.playerInGame.forEach((player) => {
            this.obstacles = this.obstacles.filter((obstacle) => {
                const isColliding = player.x + player.oX > obstacle.x && player.x - player.oX < obstacle.x + this.obstacleWidth &&
                                player.y + player.oY > obstacle.y && player.y - player.oY < obstacle.y + this.obstacleHeight;
                if(isColliding) {
                    let damage = 0;
                    if (this.game.shieldActive) {
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
                                this.game.shieldActive = false;
                                break;
                            case 'blackHole':
                                break;
                            case 'shield':
                                break;
                            case 'health':
                                this.game.shieldActive = true;
                                player.currentHealth = Math.min(player.maxHealth, player.currentHealth + 100);
                                player.displayHealth = player.currentHealth;
                                break;
                            default: 
                                break;
                        }
                        return false;
                    } else {
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
                                //shake screen
                                break;
                            case 'ufo':
                            case 'ufochild1':
                            case 'ufochild2':
                                damage = 150;
                                player.currentHealth -= damage;
                                //shake screen
                                break;
                            case 'blackHole':
                                player.currentHealth = 0;
                                break;
                            case 'shield':
                                this.game.shieldActive = true;
                                break;
                            case 'health':
                                player.currentHealth = Math.min(player.maxHealth, player.currentHealth + 100);
                                player.displayHealth = player.currentHealth;
                                //add effect
                                break;
                            default:
                                break;
                        }
                        return false;
                    }
                }
                if (obstacle.isColumn && obstacle.x + this.obstacleWidth < player.x && !obstacle.passed) {
                    this.game.scoreOverall++;
                    obstacle.passed = true;
                }  
                return this.removeObstacles(obstacle);  
            });
        });
    }

    updateMovingObstacles(obstacles, deltaTime) { //1 bug 3 days
        this.updateX(obstacles, deltaTime);
    
        this.game.playerInGame.forEach((player) => {
            obstacles = obstacles.filter((obstacle) => {
                const isColliding = player.x + player.oX > obstacle.x && player.x - player.oX < obstacle.x + this.obstacleWidth &&
                                player.y + player.oY > obstacle.y && player.y - player.oY < obstacle.y + this.obstacleHeight;
                if (isColliding) {
                    if (this.game.shieldActive) {
                        this.game.shieldActive = false;
                    } else {
                        player.currentHealth -= 200;
                    }
                    return false;
                }
                return this.removeObstacles(obstacle);
            });
        });
        return obstacles;
    }

    drawObstacles() {
        this.obstacles.forEach((obstacle) => {
            this.gameCtx.save();
            this.gameCtx.drawImage(obstacle.image, obstacle.x, obstacle.y, this.obstacleWidth, this.obstacleHeight);
            this.gameCtx.restore();
        });
    }

    drawMovingObstacles() {
        const draw =  (obstacles, isMissile) => {
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
            { type: 'cosmicDust', image: this.game.cosmicDustImage, weight: 16 },
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

        for (let i = 0; i < obstacleCount; i++) {
            const randomType = getRandomObstacleType(weightedObstacleTypes);
            if(gameTime % 60 < 30) {
                this.obstacles.push({
                    x: gameCanvas.width,
                    y: obstaclePositions[i],
                    type: randomType.type,
                    image: randomType.image,
                    passed: false,
                    isColumn: i === 0,
                    direction: - 1,
                    speed: 288
                });
            }
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
                    if (Math.abs(obstacleY - obstacle.y) < this.obstacleHeight * 1.5) {
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
                            passed: false
                        });
                        break;
                    case 'missile': 
                        obstacles.push({
                            x: 0,
                            y: obstacleY,
                            speed: 720 + 144,
                            type: 'missile',
                            image: this.game.missileImage,
                            direction: 1,    
                            passed: false
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

    createRandomMissileWarning() {
        const warningElement = document.createElement("div");
        warningElement.className = "missile-waring";
        warningElement.textContent = "Warning";

        const canvasRect = gameCanvas.getBoundingClientRect(); 
    }


}
const TIMEINTERVAL = 60;
const TIME_START = 35;
const TIME_END = 55;
const BOSS_HEIHGT = 90;

class Enemy {
    constructor(game, ctx) {
        this.game = game;
        this.ctx = ctx;
        this.width = 90;
        this.height = 90;
        this.x = gameCanvas.width;
        this.y = gameCanvas.height / 2 - this.height / 2;
        this.speed;
        this.isTimeActive = false;
        this.largeLaser = new LargeLaser(this, this.ctx);
    }

    isColliding(player, type) {
        return player.x + player.oX > type.x && player.x - player.oX < type.x + type.width &&
        player.y + player.oY > type.y && player.y - player.oY < type.y + type.height;
    }

    updatePositionLargeLaser() {
        this.largeLaser.width = this.x + this.width / 2;
        this.largeLaser.y = this.y + this.height / 2 - this.largeLaser.height / 2;
    }

    isTime(gameTime) {
        return gameTime % TIMEINTERVAL >= TIME_START && gameTime % TIMEINTERVAL <= TIME_END;
    }

    update(gameTime) {
        this.isTimeActive = this.isTime(gameTime);
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > gameCanvas.height) {
            this.y = gameCanvas.height - this.height;
        }

        if(!this.isTimeActive && this.x < gameCanvas.width) {
            this.x += this.speed;
        }
    }

    reset() {
        this.timeActive = false;
    }
}


class BOSS extends Enemy {
    constructor(game, ctx) {
        super(game, ctx);
        this.image = this.game.ufoBossImage;
        this.speed = 2;
        this.targetY = this.y;
        this.direction = 1;
        this.lasers = [];
    }

    timeLargeLaserActive(gameTime) {
        return gameTime % 60 >= 45 && gameTime % 60 <= 50;
    }

    timeSmallLaserActive(gameTime) {     
        return (gameTime % 60 >= 35 && gameTime % 60 <= 45) || (gameTime % 60 >= 50 && gameTime % 60 <= 55);    
    }

    updatePositionLargeLaser() {
        super.updatePositionLargeLaser();
        this.largeLaser.height = 20;
    }

    checkCollision() {
            this.game.playerInGame.forEach((player) => {
                this.lasers.forEach((smallLaser, index) => {
                    if(this.isColliding(player, smallLaser)) {
                        if (this.game.shieldActive) {
                            this.game.shieldActive = false;
                            this.lasers.splice(index, 1);
                        } else {
                            player.currentHealth -= 100;
                            this.lasers.splice(index, 1);
                        }
                    }
                });

                if(this.isColliding(player, this.largeLaser)) {
                    if (this.game.shieldActive) {
                        this.game.shieldActive = false;
                    } else {
                        player.currentHealth -= 10;
                    }
                }
            });
    }

    updateLaser() {
        this.lasers.forEach((laser, index) => {
            laser.update();
            if(laser.x + laser.width < 0) {
                this.lasers.splice(index, 1);
            }

        }); 
    }

    createLaser() {
        console.log(this.lasers.length);    
        if (this.lasers.length < 1) {
            const laser = new SmallLaser(this.game, this.ctx, this.x, this.y + this.height / 2);
            this.lasers.push(laser);
        }
    }


    update(gameTime) {
        console.log(this.largeLaser.x, this.largeLaser.y);
        super.update(gameTime);  
        const positionActive = this.x <= gameCanvas.width * (4 / 6);
        if(this.isTimeActive && !positionActive) {
            this.x -= this.speed;
            return;
        }

        if(positionActive) {
            if (Math.abs(this.y - this.targetY) <= 1) {
                this.targetY = Math.random() * (gameCanvas.height - this.height);
            }
            this.direction = this.targetY < this.y ? -1 : 1;               
            this.y += this.direction * this.speed;
            this.createLaser();
            if(this.timeSmallLaserActive(gameTime)) {
                this.updateLaser();
            }
            if(this.timeLargeLaserActive(gameTime)) {
                this.updatePositionLargeLaser();
            }
            this.checkCollision();
        }
        
    }
    
    drawLasers() {
        this.lasers.forEach(laser => {
            laser.draw();
        });
    }

    draw() {
        if(this.isTimeActive && this.x <= gameCanvas.width * (4 / 6 ) ) {
            if(this.timeSmallLaserActive(this.game.getCurrentGameTime())) {
                this.drawLasers(); 
            }
            if(this.timeLargeLaserActive(this.game.getCurrentGameTime())) {
                this.largeLaser.draw();
            }
        }
        this.ctx.save();
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.ctx.restore();
    }

    reset() {
        this.x = gameCanvas.width;
        this.y = gameCanvas.height / 2 - this.height / 2;
        this.targetY = this.y;
        this.direction = 1;
        this.lasers = [];
    }
}

class BOSSSMALL extends Enemy {
    constructor(game, ctx, y) {
        super(game, ctx);
        this.image = this.game.ufoComeImage;
        this.speed = 2;
        this.y = y;
    }

    timeLargeLaserActive(gameTime) {
        return gameTime % 60 >= 45 && gameTime % 60 <= 50;
    }

    checkCollision() {
        this.game.playerInGame.forEach((player) => {
            if(this.isColliding(player, this.largeLaser)) {
                if (this.game.shieldActive) {
                    this.game.shieldActive = false;
                } else {
                    player.currentHealth -= 10;
                }
            }
        });
    }

    update(gameTime) {
        super.update(gameTime);

        const positionActive = this.x >= gameCanvas.width * (5 / 6);
        if(this.isTimeActive && positionActive) {
            this.x -= this.speed;
            return;
        }

        if(this.isTimeActive) {
            this.checkCollision();
            if(this.timeLargeLaserActive(gameTime)) {
                this.updatePositionLargeLaser();
            }
        }
    }

    draw() {
        if(this.isTimeActive && this.x <= gameCanvas.width * (5 / 6) && this.timeLargeLaserActive(this.game.getCurrentGameTime())) {
            this.largeLaser.draw();
        }
        this.ctx.save();
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.ctx.restore();
    }

    reset() {
        this.x = gameCanvas.width;
    }
}

class Laser {
    constructor(game, ctx) {
        this.game = game;
        this.ctx = ctx;
        this.width = 10;
        this.height = 5;
        this.speed = 10;
        this.x =  gameCanvas.width;
        this.y;
    }

    update() {
        this.x -= this.speed;
    }
}

class SmallLaser extends Laser {
    constructor(game, ctx, x, y) {
        super(game, ctx);
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 14;
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = "purple";
        this.ctx.fillRect(this.x, this.y, this.width, this.height * 0.2);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.x, this.y + this.height * 0.2, this.width, this.height * 0.6);
        this.ctx.fillStyle = "purple";
        this.ctx.fillRect(this.x, this.y + this.height * 0.8, this.width, this.height * 0.2);
        this.ctx.restore();
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

    draw() {
        if(this.y <= 0) {
            return;
        }
        this.ctx.save();
        this.ctx.fillStyle = "gold";
        this.ctx.fillRect(this.x, this.y, this.width, this.height * 0.2);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.x, this.y + this.height * 0.2, this.width, this.height * 0.6);
        this.ctx.fillStyle = "gold";
        this.ctx.fillRect(this.x, this.y + this.height * 0.8, this.width, this.height * 0.2);
        this.ctx.restore();
    }
}

export { BOSS, BOSSSMALL, ObstacleHandler };


// Tao logic de xuat hien smallLaser va largeLaser 
// Tai dung vi tri thi moi xuat hien smallLaser va largeLaser
// Check mau
