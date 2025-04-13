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

function shakeScreen (duration) {
    const startTime = performance.now();
    const intensity = 5;

    const shake = () => {
        const elapsedTime = performance.now() - startTime;
        if(elapsedTime < duration) {
            const dx = (Math.random() - 0.5) * intensity;
            const dy = (Math.random() - 0.5) * intensity;
            gameCanvas.style.transform = `translate(${dx}px, ${dy}px)`;
            requestAnimationFrame(shake);
        } else {
            gameCanvas.style.transform = 'translate(0, 0)';
        }
    };

    shake();
}

function hasShield(player, gameCtx) {
    gameCtx.save();
    const gradient = gameCtx.createRadialGradient(
        player.x + player.width / 2, player.y + player.height / 2, 0,  // Tâm trong (vị trí trung tâm, bán kính 0)
        player.x +  player.width / 2, player.y + player.height / 2, player.width // Tâm ngoài (vị trí trung tâm, bán kính 50)
    );

     // Tạo dải màu từ viền vàng đậm vào trung tâm trong suốt
    gradient.addColorStop(1, 'rgba(255, 255, 224, 1)');   
    gradient.addColorStop(1, 'rgba(255, 255, 224, 0.8)');   
    gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.6)'); 
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');

    gameCtx.fillStyle = gradient;  // Áp dụng gradient làm màu vẽ
    gameCtx.beginPath();
    gameCtx.arc(player.x + player.width / 2, player.y + player.height / 2, 50, 0, 2 * Math.PI); // Vẽ hình tròn với bán kính 50
    gameCtx.fill();  // Tô hình tròn với dải màu đã tạo
    gameCtx.restore();
}
export {smokeEffect, shakeScreen, hasShield};