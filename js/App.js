import { GameHard ,GameMedium, GameEasy, GameHandGesture } from './game.js';

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

window.addEventListener('load', function () {
    // let playCount = parseInt(localStorage.getItem('playCount')) || 0;

    // function startGame() {
    //     playCount++;
    //     localStorage.setItem('playCount', playCount);
    //     console.log(`Số lượt chơi: ${playCount}`);
    // }
    let game;
    
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    const gameflabird = document.querySelector(".game-fla-bird");
    const handCanvas = document.querySelector("#handCanvas");
    const btnPre = document.querySelector('.btn-pre');
    const btnNext = document.querySelector('.btn-next');
    const firstList = document.querySelector('.first');
    const secondList = document.querySelector('.second');
    const thirdList = document.querySelector('.third');
    const choicePlayer = document.querySelectorAll('.choice-player-game');

    document.querySelector(".btn-start-game").addEventListener("click", (e) => {
        document.querySelector(".header").classList.replace("visible", "hidden");
        document.querySelector(".tutorial").classList.replace("hidden", "visible");
        
    });

    const arrayList = [firstList, secondList, thirdList];
    let currentIndex = 0;
    btnNext.onclick = () => {

        if(currentIndex < arrayList.length - 1) {
            arrayList[currentIndex].classList.replace("visible", "notvisibility");
            arrayList[currentIndex + 1].classList.replace("notvisibility", "visible");
            currentIndex++;
        }
    };
    btnPre.onclick = () => {
        if(currentIndex <= arrayList.length - 1 && currentIndex > 0) {
            arrayList[currentIndex].classList.replace("visible", "notvisibility");
            arrayList[currentIndex - 1].classList.replace("notvisibility", "visible");
            currentIndex--;
        }
    };

    
    choicePlayer.forEach((key, index) => {
        key.addEventListener('click', () => {
            switch(index) {
                case 0:
                    game = new GameEasy();
                    break;
                case 1:
                    game = new GameMedium();
                    break;
                case 2:
                    game = new GameHard();
                    break;
                }
            document.querySelector(".choice-player").classList.add("hidden");
            document.querySelector(".button-player ").classList.remove("hidden");
        });
    });

    const buttonPlayer = document.querySelectorAll('.btn-play');
    buttonPlayer.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            document.querySelector(".tutorial").classList.replace("visible", "hidden");
            gameflabird.classList.replace("hidden", "visible");
            if(index === 0) {
                game = new GameHandGesture();
                game.handgestrue.start();
                game.udpatePlayerHandgestrue(index);
            } else {
                game.updatePlayers(index);
            }
        });
    });

    const keyFlap = ["Space", "KeyA", "KeyK"];
    const keyShoot = ["KeyM", "KeyS", "KeyL"];
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
                // startGame();
                game.render(); 
            }  
            if(e.code === "KeyP") {
                game.pause = true;
                game.pauseTime = performance.now();
            }     
        }

        game.players.forEach((player, index) => {
            if(game.isGameStarted) {
                let keyflap = keyFlap[index];
                let keyshoot = keyShoot[index];
                if(!player.isFalling && !player.pressed && e.code === keyflap) {
                    player.flap();
                    player.currentMana -= 5;
                    player.pressed = true;
                }
                // if(e.code === keyshoot) {
                //     player.checkShoot = true;
                // }

                // console.log(e.code);
            }
        });
    });

    window.addEventListener("keyup" , (e) => {
        game.players.forEach((player, index) => {
            let playerKey = keyFlap[index];
            let shootKey = keyShoot[index];
            if (e.code === playerKey) {
                player.pressed = false;
            }

            if (e.code === shootKey) {
                player.checkShoot = false;
            }
        });
    });
    //Demo mobile
    gameflabird.onclick = () => {
        if(!game.hasTouch) {
            game.hasTouch = true;
            game.startTime = performance.now();
            game.isGameStarted = true;
            game.render(); 
        }
    };
    
    gameflabird.addEventListener('touchstart', function(event) {
        if(game.players[0].currentHealth > 0) game.players[0].flap();
    });


    let lastTime = 0;
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    function animate(timeStamp) {  
        const deltaTime = (timeStamp - lastTime) / 1000;    
        lastTime = timeStamp;
        if(game !== undefined) {
            game.render(deltaTime);
        }
        requestAnimationFrame(animate);
    }
    animate(0);
});
