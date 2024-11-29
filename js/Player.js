import smokeEffect from "./gameEffects.js";

class Player {
    constructor(game, image, gameCtx, id) {
        this.game = game;
        this.image = image;
        this.gameCtx = gameCtx;
        this.id = id;
        this.smoke = smokeEffect(this.gameCtx);

        this.isAlive = true;
        this.isFalling = false;
        this.maxHealth = 10000;
        this.currentHealth = this.maxHealth;
        this.displayHealth = this.currentHealth;
        this.scorePlayer = 0;

        this.x =  gameCanvas.width / 3;
        this.y =  gameCanvas.height / 2;
        this.g =  1050;
        this.l =  -400;
        this.v =  0;
        this.w =  60;
        this.h =  60;
        this.oX =  this.w / 2;
        this.oY =  this.h / 2;
    }

    flap() {
        this.v = this.l;
    }

    updatePlayer() {
        const deltaTime = this.game.time.getDeltaTime();
        this.v += this.g * deltaTime;
        this.y += this.v * deltaTime;

        this.scorePlayer = this.game.scoreOverall;
        this.smoke.updateSmokeParticles(deltaTime);
        if (this.currentHealth <= 0) {
            this.isFalling = true;
        }

        if(this.isFalling) {
            this.y += 0.4 * 144 * deltaTime;
        }

        if (this.displayHealth > this.currentHealth) {
            this.displayHealth -= 5;
            if(this.displayHealth < this.currentHealth) {
                this.displayHealth = this.currentHealth;
            }
        }

        if(this.currentHealth < this.maxHealth * 0.3) {
            this.smoke.addSmokeParticles(this.x - 50, this.y);
        }
        
        if (this.y - this.oY <= 0) {
            this.y = this.oY;
            this.v = 0;
        }

        if (this.y -this.oY >= gameCanvas.height) {
            this.isAlive = false;
        }

        if(!this.isAlive) {
            this.updateScore();   
        }
    }

    updateScore() {
        const scorePlayers = this.game.scorePlayers;
            this.scorePlayer = this.game.scoreOverall;
            scorePlayers.push({score: this.scorePlayer, id: this.id});
            if(scorePlayers.length > 1) {
                scorePlayers.sort((a, b) => a.id - b.id);
            } 
    }
    
    drawPlayer(healthX, healthY, scoreX, scoreY) {
        if (this.isAlive) {
            this.gameCtx.save();
            this.gameCtx.translate(this.x, this.y);
            this.gameCtx.drawImage(this.image, -this.oX, -this.oY, this.w, this.h);
            this.gameCtx.restore();
            this.drawScorePlayer(scoreX, scoreY);
            this.drawHealthPlayer(healthX, healthY);
            this.smoke.drawSmokeParticles();
        }
    }

    drawHealthPlayer(healthX, healthY) {
        this.gameCtx.save(); 
        this.gameCtx.fillStyle = "rgba(255, 36, 33, 1)";
        this.gameCtx.fillRect(healthX, healthY, Math.max((this.displayHealth / this.maxHealth) * 200, 0), 20);
        this.gameCtx.restore(); 

    }

    drawScorePlayer(scoreX, scoreY) {
        this.gameCtx.fillStyle = "#fff";
        this.gameCtx.font = "20px Ubuntu";
        this.gameCtx.fillText("Score: " + this.scorePlayer, scoreX, scoreY);
    }

    resetPlayer() {
        this.currentHealth = this.maxHealth;
        this.displayHealth = this.maxHealth;
        this.isAlive = true;
        this.isFalling = false;
        this.scorePlayer = 0;

        this.x = gameCanvas.width / 3;
        this.y = gameCanvas.height / 2;
        this.v = 0;

        this.smoke.reset();
    }
}

export default Player;