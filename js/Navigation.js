/**
 * Navigation.js - SPA Navigation for Flappy Bird with Hand Gesture
 * Handles navigation between header, tutorial, and game sections
 */

export default class Navigation {
    constructor() {
        // Main sections
        this.sections = {
            header: document.querySelector(".header"),
            tutorial: document.querySelector(".tutorial"),
            game: document.querySelector(".game-fla-bird")
        };
        
        // Tutorial related elements
        this.tutorialLists = {
            first: document.querySelector('.tutorial-list.first'),
            second: document.querySelector('.tutorial-list.second'),
            third: document.querySelector('.tutorial-list.third'),
            fourth: document.querySelector('.tutorial-list.fourth')
        };
        
        // Navigation controls
        this.controls = {
            startButton: document.querySelector(".btn-start-game"),
            nextButton: document.querySelector('.btn-next'),
            prevButton: document.querySelector('.btn-pre'),
            backToMenuButtons: [],
            backButton: document.querySelector('.btn-back-menu'),
            selectModeButtons: document.querySelectorAll(".select-mode-game"),
            modeChildButtons: document.querySelectorAll(".mode-child-game"),
            choiceLevelButtons: document.querySelectorAll('.choice-player-game'),
            handgestureButton: document.getElementById("handgesture"),
            keyboardButton: document.getElementById("keyboard"),
            playerButtons: document.querySelectorAll(".tutorial .button-player:last-of-type .btn-play")
        };
        
        // Containers
        this.containers = {
            selectMode: document.querySelector(".select-mode"),
            modeChild: document.querySelector(".mode-child"),
            choicePlayer: document.querySelector(".choice-player"),
            buttonPlayer: document.querySelector(".tutorial .button-player"),
            playerSelection: document.querySelector(".tutorial .button-player:last-of-type")
        };
        
        // Current state
        this.currentTutorialIndex = 0;
        this.tutorialListsArray = [
            this.tutorialLists.first,
            this.tutorialLists.second,
            this.tutorialLists.third,
            this.tutorialLists.fourth
        ];
        
        // Navigation state tracking
        this.navigationStack = [];
        this.currentScreen = 'selectMode';
        
        // Initialize navigation
        this.init();
    }
    
    init() {
        // Set up main navigation
        this.setupMainNavigation();
        
        // Set up tutorial navigation
        this.setupTutorialNavigation();
        
        // Set up game mode selection
        this.setupModeSelection();
        
        // Set up back button functionality
        this.setupBackButton();
    }
    
    setupMainNavigation() {
        // Start game button (header -> tutorial)
        this.controls.startButton.addEventListener('click', () => {
            this.navigateTo('tutorial');
        });
        
        // Add navigation event to handgesture button (tutorial -> game)
        this.controls.handgestureButton.addEventListener('click', () => {
            this.controls.backButton.classList.add('hidden');
            this.navigateTo('game');
            // Additional game setup will be handled by the App.js
        });
    }
    
    setupTutorialNavigation() {
        // Next and previous buttons for tutorial lists
        this.controls.nextButton.addEventListener('click', () => {
            this.navigateTutorialStep(1);
        });
        
        this.controls.prevButton.addEventListener('click', () => {
            this.navigateTutorialStep(-1);
        });
    }
    
    setupBackButton() {
        // Set up the single back button functionality
        this.controls.backButton.addEventListener('click', (e) => {
            // Prevent default behavior
            e.preventDefault();
            e.stopPropagation();
            
            // Navigate based on current screen
            this.handleBackNavigation();
        });
    }
    
    handleBackNavigation() {
        switch (this.currentScreen) {
            case 'modeChild':
                // Go back to select mode from mode child screen
                this.containers.modeChild.classList.add('hidden');
                this.containers.selectMode.classList.remove('hidden');
                this.currentScreen = 'selectMode';
                this.controls.backButton.classList.add('hidden');
                break;
                
            case 'choicePlayer':
                // Go back to select mode from choice player screen
                this.containers.choicePlayer.classList.add('hidden');
                this.containers.selectMode.classList.remove('hidden');
                this.currentScreen = 'selectMode';
                this.controls.backButton.classList.add('hidden');
                break;
                
            case 'buttonPlayer':
                // Go back to the previous screen (either mode child or choice player)
                this.containers.buttonPlayer.classList.add('hidden');
                
                if (this.navigationStack.length > 0) {
                    const previousScreen = this.navigationStack.pop();
                    this.containers[previousScreen].classList.remove('hidden');
                    this.currentScreen = previousScreen;
                } else {
                    // Fallback to select mode if navigation stack is empty
                    this.containers.selectMode.classList.remove('hidden');
                    this.currentScreen = 'selectMode';
                    this.controls.backButton.classList.add('hidden');
                }
                break;
                
            case 'playerSelection':
                // Go back to button player screen
                this.containers.playerSelection.classList.add('hidden');
                this.containers.buttonPlayer.classList.remove('hidden');
                this.currentScreen = 'buttonPlayer';
                break;
                
            default:
                // Default behavior: hide back button and reset to select mode
                this.controls.backButton.classList.add('hidden');
                this.resetToSelectMode();
                break;
        }
    }
    
    setupModeSelection() {
        // Select mode buttons (For Children / Adventure Mode)
        this.controls.selectModeButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.containers.selectMode.classList.add("hidden");
                
                if (index === 0) { // For Children
                    this.containers.modeChild.classList.remove("hidden");
                    this.currentScreen = 'modeChild';
                } else { // Adventure Mode
                    this.containers.choicePlayer.classList.remove("hidden");
                    this.currentScreen = 'choicePlayer';
                }
                
                // Show back button since we're no longer on the main menu
                this.controls.backButton.classList.remove('hidden');
            });
        });
        
        // Mode child buttons (Easy, Medium, Hard)
        this.controls.modeChildButtons.forEach((button) => {
            button.addEventListener('click', () => {
                // Save current screen to navigation stack before moving on
                this.navigationStack.push(this.currentScreen);
                
                this.containers.modeChild.classList.add("hidden");
                this.containers.buttonPlayer.classList.remove("hidden");
                this.currentScreen = 'buttonPlayer';
                // Game mode selection will be handled by App.js
            });
        });
        
        // Choice level buttons (Easy, Medium, Hard)
        this.controls.choiceLevelButtons.forEach((button) => {
            button.addEventListener('click', () => {
                // Save current screen to navigation stack before moving on
                this.navigationStack.push(this.currentScreen);
                
                this.containers.choicePlayer.classList.add("hidden");
                this.containers.buttonPlayer.classList.remove("hidden");
                this.currentScreen = 'buttonPlayer';
                // Game difficulty selection will be handled by App.js
            });
        });
        
        // Keyboard button (shows player selection)
        this.controls.keyboardButton.addEventListener('click', () => {
            this.containers.buttonPlayer.classList.add("hidden");
            this.containers.playerSelection.classList.remove("hidden");
            this.currentScreen = 'playerSelection';
        });
        
        // Player selection buttons (1P, 2P, 3P)
        this.controls.playerButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.controls.backButton.classList.add('hidden');
                this.navigateTo('game');
                // Player selection will be handled by App.js
            });
        });
    }
    
    navigateTo(section) {
        // Hide all sections first
        Object.values(this.sections).forEach(element => {
            element.classList.add('hidden');
            element.classList.remove('visible');
        });
        
        // Show the requested section
        this.sections[section].classList.remove('hidden');
        this.sections[section].classList.add('visible');
        
        // Handle special cases
        if (section === 'tutorial') {
            // Reset tutorial to the first step when entering tutorial section
            this.resetTutorial();
        }
    }
    
    navigateTutorialStep(direction) {
        const newIndex = this.currentTutorialIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.tutorialListsArray.length) {
            // Hide current list
            this.tutorialListsArray[this.currentTutorialIndex].classList.replace("visible", "notvisibility");
            
            // Show new list
            this.tutorialListsArray[newIndex].classList.replace("notvisibility", "visible");
            
            // Update current index
            this.currentTutorialIndex = newIndex;
        }
    }
    
    resetToSelectMode() {
        // Reset containers
        this.containers.selectMode.classList.remove('hidden');
        this.containers.modeChild.classList.add('hidden');
        this.containers.choicePlayer.classList.add('hidden');
        this.containers.buttonPlayer.classList.add('hidden');
        this.containers.playerSelection.classList.add('hidden');
        
        // Reset current screen
        this.currentScreen = 'selectMode';
        
        // Clear navigation stack
        this.navigationStack = [];
    }
    
    resetTutorial() {
        // Reset to first step
        this.tutorialListsArray.forEach((list, index) => {
            if (index === 0) {
                list.classList.remove('notvisibility');
                list.classList.add('visible');
            } else {
                list.classList.remove('visible');
                list.classList.add('notvisibility');
            }
        });
        
        // Reset to select mode
        this.resetToSelectMode();
        
        // Reset index
        this.currentTutorialIndex = 0;
    }
}