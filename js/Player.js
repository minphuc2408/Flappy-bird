import {smokeEffect, hasShield} from "./gameEffects.js";

class Player {
    constructor(game, image, gameCtx, id) {
        this.game = game;
        this.image = image;
        this.gameCtx = gameCtx;
        this.id = id;
        this.smoke = smokeEffect(this.gameCtx);

        this.isAlive = true;
        this.isFalling = false;
        this.maxHealth = 2000;
        this.maxMana = 200;
        this.currentHealth = this.maxHealth;
        this.currentMana = this.maxMana;
        this.displayHealth = this.currentHealth;
        this.displayMana = this.currentMana;
        this.score = 0;
        this.shieldActive = false;
        this.pressed = false;

        this.g = 1050;
        this.l = -400;
        this.v = 0;
        this.width = 60;
        this.height = 60;
        this.x =  gameCanvas.width / 3;
        this.y =  gameCanvas.height / 2 - this.height / 2;
    }

    flap() {
        this.v = this.l;
    }

    update(deltaTime) {
        this.v += this.g * deltaTime;
        this.y += this.v * deltaTime;
        this.score = this.game.scoreOverall;
        this.smoke.updateSmokeParticles(deltaTime);
        if (this.currentHealth <= 0 || this.currentMana <= 0) {
            console.log("1")
            this.isFalling = true;
        }

        if(this.isFalling) {
            this.y += 0.4 * 144 * deltaTime;
        }

        if(this.currentHealth < this.maxHealth * 0.3) {
            this.smoke.addSmokeParticles(this.x, this.y + this.height / 2);
        }

        if(this.shieldActive) {
            hasShield(this, this.gameCtx);
        }
        
        if (this.y <= 0) {
            this.y = 0;
            this.v = 0;
        }

        if (this.y -this.height >= gameCanvas.height) {
            this.isAlive = false;
        }

        if(!this.isAlive) {
            this.game.scorePlayers.push({
                score: this.score,
                id: this.id
            });

            this.game.scorePlayers.sort((a, b) => a.id - b.id);
        }

        if(this.displayHealth > this.currentHealth) {
            this.displayHealth -= 5;
        } else {
            this.displayHealth = this.currentHealth;
        }

        if(this.displayMana > this.currentMana) {
            this.displayMana -= 0.5;
        } else {
            this.displayMana = this.currentMana;
        }
    }

    draw(scoreX, scoreY, healthX, healthY, manaX, manaY) {
        if (this.isAlive) {
            this.gameCtx.save();
            this.gameCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
            this.gameCtx.restore();
            this.drawScore(scoreX, scoreY);
            this.drawHealth(healthX, healthY);
            this.drawMana(manaX, manaY);
            this.smoke.drawSmokeParticles();
        }
    }

    drawHealth(healthX, healthY) {
        this.gameCtx.save(); 
        this.gameCtx.fillStyle = "rgba(255, 36, 33, 1)";
        this.gameCtx.fillRect(healthX, healthY, Math.max((this.displayHealth / this.maxHealth) * 200, 0), 20);
        this.gameCtx.restore(); 

    }

    drawScore(scoreX, scoreY) {
        this.gameCtx.save();
        this.gameCtx.fillStyle = "#fff";
        this.gameCtx.font = "20px Ubuntu";
        this.gameCtx.fillText("Score: " + this.score, scoreX, scoreY);
        this.gameCtx.restore();
    }

    drawMana(manaX, manaY) {
        this.gameCtx.save();
        this.gameCtx.fillStyle = "rgba(0, 214, 255, 1)";
        this.gameCtx.fillRect(manaX, manaY, Math.max((this.displayMana / this.maxMana) * 200, 0), 10);
        this.gameCtx.restore();
    }

    reset() {
        this.currentMana = this.maxMana;
        this.currentHealth = this.maxHealth;
        this.displayHealth = this.maxHealth;
        this.displayMana = this.maxMana;
        this.isAlive = true;
        this.isFalling = false;
        this.score = 0;

        this.x = gameCanvas.width / 3;
        this.y = gameCanvas.height / 2;
        this.v = 0;

        this.smoke.reset();
    }
}

export default Player;