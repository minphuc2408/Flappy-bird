    
import Game from "./Game.js"

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

window.addEventListener('load', function () {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    const gameflabird = document.querySelector(".game-fla-bird");
    const handCanvas = document.querySelector("#handCanvas");
    const btnPre = document.querySelector('.btn-pre');
    const btnNext = document.querySelector('.btn-next');
    const firstList = document.querySelector('.first');
    const secondList = document.querySelector('.second');

    document.querySelector(".btn-start-game").addEventListener("click", () => {
        document.querySelector(".header").classList.replace("visible", "hidden");
        document.querySelector(".tutorial").classList.replace("hidden", "visible");
    });

    btnNext.onclick = () => {
        firstList.classList.add("notvisibility");
        secondList.classList.replace("notvisibility", "visible");
    }
    btnPre.onclick = () => {
        secondList.classList.add("notvisibility");
        firstList.classList.remove("notvisibility");
    }

    const game = new Game();

    const buttonPlayer = document.querySelectorAll('.btn-play');
    buttonPlayer.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            document.querySelector(".tutorial").classList.replace("visible", "hidden");
            gameflabird.classList.replace("hidden", "visible");
            if(index === 0) {
                game.handgestrue.start();
                game.udpatePlayerHandgestrue(index);
            } else {
                game.updatePlayers(index);
            }
        });
    });

    const key = ["Space", "KeyA", "KeyL"];
    window.addEventListener("keydown", (e) => {
        if(gameflabird.classList.contains("visible")) {
            if(e.code === "KeyO") {
                handCanvas.classList.remove("hidden");
            }
            if(e.code === "KeyQ") {
                handCanvas.classList.add("hidden");
            }
            if(e.code === "Enter") {
                game.startTime = performance.now();
                game.isGameStarted = true;
                game.render(); 
            }              
        }

        game.players.forEach((player, index) => {
            if(game.isGameStarted) {
                let keyPlay = key[index];
                if(!player.isFalling && !player.pressed && e.code === keyPlay) {
                    player.flap();
                    player.currentMana -= 5;
                    player.pressed = true;
                }
            }
        });
    });

    window.addEventListener("keyup" , (e) => {
        game.players.forEach((player, index) => {
            const playerKey = key[index];
            if (e.code === playerKey) {
                player.pressed = false;
            }
        });
    });
    //Demo mobile
    let hasTouch = false;
    gameflabird.onclick = () => {
        if(!hasTouch) {
            hasTouch = true;
            game.startTime = performance.now();
            game.isGameStarted = true;
            game.render(); 
        }
    };

    gameflabird.addEventListener('touchstart', function(event) {
        game.players[0].flap();
    });

    let lastTime = 0;
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    function animate(timeStamp) {  
        const deltaTime = (timeStamp - lastTime) / 1000;    
        lastTime = timeStamp;

        game.render(deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);
});