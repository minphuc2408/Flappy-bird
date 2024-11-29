function smokeEffect(gameCtx) {
    let particles = [];

    function addSmokeParticles(x, y) {
        particles.push({
            x: x,
            y: y,
            alpha: 1.0,
            size: Math.random() * 5 + 8,
            speedX: (Math.random() * 2 + 1) * 60,
            speedY: (Math.random() * 1 - 0.5) * 60
        });
    }

    function updateSmokeParticles(deltaTime) {
        particles.forEach(particle => {
            particle.x -= particle.speedX * deltaTime;
            particle.y += particle.speedY * deltaTime;
            particle.alpha -= 0.01;
        });

        particles = particles.filter(particle => particle.alpha > 0.3);
    }
    
    function drawSmokeParticles() {
        particles.forEach(particle => {
            gameCtx.fillStyle = `rgba(128, 128, 128, ${particle.alpha})`; // Màu xám
            gameCtx.beginPath();
            gameCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, true);
            gameCtx.fill();
            gameCtx.restore();
        });
    }

    function reset() {
        particles = [];
    }

    return {
        updateSmokeParticles,
        drawSmokeParticles,
        addSmokeParticles,
        reset
    }
}

export default smokeEffect;