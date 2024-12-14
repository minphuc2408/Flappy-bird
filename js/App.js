
import { GameHard ,GameMedium, GameEasy, GameChild } from './Game.js';

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

window.addEventListener('load', function () {
    // let playCount = parseInt(localStorage.getItem('playCount')) || 0;

    // function startGame() {
    //     playCount++;
    //     localStorage.setItem('playCount', playCount);
    //     console.log(`Số lượt chơi: ${playCount}`);
    // }
    const levelGame = [new GameChild(), new GameEasy(), new GameMedium(), new GameHard()];
    let game = null;
    
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    const startGame = document.querySelector(".btn-start-game");
    const header = document.querySelector(".header");
    const tutorial = document.querySelector(".tutorial");
    const gameflabird = document.querySelector(".game-fla-bird");

    const handCanvas = document.querySelector("#handCanvas");
    const btnPre = document.querySelector('.btn-pre');
    const btnNext = document.querySelector('.btn-next');
    const firstList = document.querySelector('.first');
    const secondList = document.querySelector('.second');
    const thirdList = document.querySelector('.third');

    const handgesture = document.getElementById("handgesture");
    const keyboard = document.getElementById("keyboard");

    const choicePlayer = document.querySelector(".choice-player");
    const choiceLevel = document.querySelectorAll('.choice-player-game');

    const buttonPlayer = document.querySelector(".tutorial .button-player:last-of-type");
    
    startGame.onclick = () => {
        header.classList.replace("visible", "hidden");
        tutorial.classList.replace("hidden", "visible");
    };

    choiceLevel.forEach((level, index) => {
        level.onclick = function () {
            game = levelGame[index];
            choicePlayer.classList.add("hidden");
            document.querySelector(".tutorial .button-player").classList.remove("hidden");
        }
    });

    handgesture.onclick = () => {
        document.querySelector(".tutorial .button-player").classList.add("hidden");
        tutorial.classList.replace("visible", "hidden");
        gameflabird.classList.replace("hidden", "visible");
        game.udpatePlayerHandgestrue();
        game.reset();
        game.handgesture.start();
    };

    keyboard.onclick = () => {
        document.querySelector(".tutorial .button-player").classList.add("hidden");
        buttonPlayer.classList.remove("hidden");
    }

    document.querySelectorAll(".button-player:last-of-type .btn-play").forEach((key, index) => {
        key.onclick = function () {
            tutorial.classList.replace("visible", "hidden");
            gameflabird.classList.replace("hidden", "visible");
            game.updatePlayers(index + 1);
            game.reset();
        }
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
        if(game !== null) {
            game.render(deltaTime);
        }
        requestAnimationFrame(animate);
    }
    animate(0);
    
});
