import { GameHard ,GameMedium, GameEasy, GameChild, Game, GameChildEasy } from './Game.js';
import Navigation from './Navigation.js';

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
    
    // Initialize SPA navigation
    const navigation = new Navigation();
    
    // Audio controls
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

    // Handle game-specific events that work with the navigation
    const handgesture = document.getElementById("handgesture");
    const keyboard = document.getElementById("keyboard");
    const selectModeChild = document.querySelectorAll(".select-mode-game");
    const modeChilds = document.querySelectorAll(".mode-child-game");
    const choiceLevel = document.querySelectorAll('.choice-player-game');

    // Game mode selection logic
    selectModeChild.forEach((select, index) => {
        select.addEventListener('click', () => {
            // The navigation between screens is handled by the Navigation class
            // Here we only handle the game logic specific events
            if (index === 0) {
                // For Children mode selected
            } else {
                // Adventure Mode selected
            }
        });
    });

    modeChilds.forEach((mode, index) => {
        mode.addEventListener('click', () => {
            switch (index + 1) {
                case 1: 
                    game = levelGame[0]; // Game Child
                    break;
                case 2:
                    // Medium difficulty
                    break;
                case 3:
                    // Hard difficulty
                    break;
            }
        });
    });

    choiceLevel.forEach((level, index) => {
        level.addEventListener('click', () => {
            game = levelGame[index + 1];
        });
    });

    // Handle handgesture mode
    handgesture.addEventListener('click', () => {
        soundApp.pause();
        game.udpatePlayerHandgestrue();
        game.reset();
        game.handgesture.start();
    });

    // Handle player selection after keyboard selection
    document.querySelectorAll(".tutorial .button-player:last-of-type .btn-play").forEach((key, index) => {
        key.addEventListener('click', () => {
            soundApp.pause();
            game.updatePlayers(index + 1);
            game.reset();
        });
    });

    // Keyboard controls
    const keyFlap = ["Space", "KeyA", "KeyK"];
    const keyShoot = ["KeyB", "KeyS", "KeyL"];
    window.addEventListener("keydown", (e) => {
        if(document.querySelector(".game-fla-bird").classList.contains("visible")) {
            if(e.code === "KeyO") {
                document.querySelector("#handCanvas").classList.remove("hidden");
            }
            if(e.code === "KeyQ") {
                document.querySelector("#handCanvas").classList.add("hidden");
            }
            if(e.code === "Enter") {
                game.startTime = performance.now();
                game.isGameStarted = true;
            } 
            if(e.code === "KeyP") {
                game.pause = true;
                game.pauseTime = performance.now();
            }
            if(e.code === "Escape") {
                // Navigate back to menu on Escape
                document.querySelector('.back-to-menu')?.click();
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

    // Animation loop
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