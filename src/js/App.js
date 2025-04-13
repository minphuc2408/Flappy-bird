import { GameHard ,GameMedium, GameEasy, GameChild, Game, GameChildEasy } from './Game.js';

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");
function updateSize () {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
}

window.addEventListener("resize", () => {
    updateSize();
});

window.addEventListener('load', function () {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    
    const soundApp = document.getElementById("app");
    const clickSound = document.getElementById("click");
    const on = document.querySelector(".on");
    const off = document.querySelector(".off");

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    soundApp.addEventListener("ended", function () {
        soundApp.currentTime = 0;
        soundApp.play();
    });

    window.onclick = () => {
        playSound(clickSound);
    }

    const levelGame = [new GameChild(), new GameEasy(), new GameMedium(), new GameHard()];
    let game = new Game();

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
    const fourthList = document.querySelector('.fourth');
    
    const selectMode = document.querySelector(".select-mode");
    const selectModeChild = document.querySelectorAll(".select-mode-game");
    const modeChild = this.document.querySelector(".mode-child");
    const modeChilds = document.querySelectorAll(".mode-child-game");
    const handgesture = document.getElementById("handgesture");
    const keyboard = document.getElementById("keyboard");

    const choicePlayer = document.querySelector(".choice-player");
    const choiceLevel = document.querySelectorAll('.choice-player-game');

    const buttonPlayer = document.querySelector(".tutorial .button-player:last-of-type");
    
    off.onclick = function (e) {
        game.sound.play();
        off.classList.add("hidden");
        on.classList.remove("hidden");
        e.stopPropagation();
    };
    on.onclick = function (e) {
        game.sound.pause();
        off.classList.remove("hidden");
        on.classList.add("hidden");
        e.stopPropagation();
    };

    startGame.onclick = () => {
        soundApp.play();
        header.classList.replace("visible", "hidden");
        tutorial.classList.replace("hidden", "visible");
    };

    selectModeChild.forEach((select, index) => {
        select.onclick = () => {
            switch (index + 1) {
                case 1: 
                    selectMode.classList.add("hidden");
                    modeChild.classList.remove("hidden");
                    break;
                case 2:
                    selectMode.classList.add("hidden");
                    choicePlayer.classList.remove("hidden");
                    break;
            }
        }
    });

    modeChilds.forEach((mode, index) => {
        mode.onclick = function (e) {
            switch (index + 1) {
                case 1: 
                    game = levelGame[0];
                    modeChild.classList.add("hidden");
                    document.querySelector(".tutorial .button-player").classList.remove("hidden");
                    break;
                case 2:
                case 3:
                    break;
            }
        }
    });

    choiceLevel.forEach((level, index) => {
        level.onclick = function () {
            game = levelGame[index + 1];
            choicePlayer.classList.add("hidden");
            document.querySelector(".tutorial .button-player").classList.remove("hidden");
        }
    });

    handgesture.onclick = () => {
        document.querySelector(".tutorial .button-player").classList.add("hidden");
        tutorial.classList.replace("visible", "hidden");
        gameflabird.classList.replace("hidden", "visible");
        soundApp.pause();
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
            soundApp.pause();
            game.updatePlayers(index + 1);
            game.reset();
        }
    });

    const arrayList = [firstList, secondList, thirdList, fourthList];
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
    const keyShoot = ["KeyB", "KeyS", "KeyL"];
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
                if(e.code === keyshoot && (game === levelGame[3])) {
                    game.playSound(game.playerShootSound);
                    player.checkShoot = true;
                }
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