#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <SDL2/SDL_ttf.h>
#include <cstdlib>
#include <ctime>
#include <string>
#include <vector>

#ifdef _WIN32
#undef main // Undefine main if defined by SDL
#endif

// Screen dimensions
const int SCREEN_WIDTH = 580;
const int SCREEN_HEIGHT = 720;

// Speed constants
int ENEMY_SPEED = 2; // Enemy movement speed

class Car {
public:
    Car(int x, int y, int speed, SDL_Texture* texture)
        : x(x), y(y), speed(speed), texture(texture) {}

    void moveLeft() { if (x > 0) x -= speed; }
    void moveRight() { if (x < SCREEN_WIDTH - 100) x += speed; }
    void draw(SDL_Renderer* renderer) {
        SDL_Rect carRect = {x, y, 70, 70};
        SDL_RenderCopy(renderer, texture, NULL, &carRect);
    }

    SDL_Rect getRect() const { return {x, y, 70, 70}; }

private:
    int x, y, speed;
    SDL_Texture* texture;
};

class Enemy {
public:
    Enemy(int x, int y, SDL_Texture* texture)
        : x(x), y(y), texture(texture), active(true) {}

    void move() { y += ENEMY_SPEED; }
    void reset(int newX, int newY) { x = newX; y = newY; }
    void draw(SDL_Renderer* renderer) {
        if (active) {
            SDL_Rect enemyRect = {x, y, 40, 40};
            SDL_RenderCopy(renderer, texture, NULL, &enemyRect);
        }
    }

    SDL_Rect getRect() const { return {x, y, 40, 40}; }
    bool isActive() const { return active; }
    void deactivate() { active = false; }

private:
    int x, y;
    SDL_Texture* texture;
    bool active;
};

class Track {
public:
    Track() : texture(nullptr), offsetY(0) {} // Default constructor
    Track(SDL_Texture* texture) : texture(texture), offsetY(0) {}

    void move() {
        offsetY += ENEMY_SPEED;
        if (offsetY >= SCREEN_HEIGHT) {
            offsetY = 0;
        }
    }

    void draw(SDL_Renderer* renderer) {
        SDL_Rect trackRect1 = {0, offsetY, SCREEN_WIDTH, SCREEN_HEIGHT};
        SDL_Rect trackRect2 = {0, offsetY - SCREEN_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT};
        SDL_RenderCopy(renderer, texture, NULL, &trackRect1);
        SDL_RenderCopy(renderer, texture, NULL, &trackRect2);
    }

private:
    SDL_Texture* texture;
    int offsetY;
};

class Game {
public:
    Game()
        : window(nullptr), renderer(nullptr), carTexture(nullptr),
          enemyTexture(nullptr), trackTexture(nullptr), font(nullptr),
          car(SCREEN_WIDTH / 2 - 20, 3 * SCREEN_HEIGHT / 4, 5, nullptr),
          score(0), moveLeft(false), moveRight(false), lastSpeedIncreaseTime(0),
          gameState(WAITING) {}

    bool initSDL();
    void closeSDL();
    bool loadTextures();
    bool loadFont();
    void run();
    void resetGame();

private:
    void handleEvents();
    void update();
    void render();
    void drawWaitingScreen();
    void drawGameOverScreen();
    void updateScore();
    bool checkCollision(SDL_Rect carRect, SDL_Rect enemyRect);
    void createEnemies(int numEnemies);

    SDL_Window* window;
    SDL_Renderer* renderer;
    SDL_Texture* carTexture;
    SDL_Texture* enemyTexture;
    SDL_Texture* trackTexture;
    TTF_Font* font;
    Car car;
    std::vector<Enemy> enemies;
    Track track;
    int score;
    bool moveLeft;
    bool moveRight;
    Uint32 lastSpeedIncreaseTime;

    enum GameState { WAITING, PLAYING, GAME_OVER };
    GameState gameState;
};

bool Game::initSDL() {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        printf("SDL could not initialize! SDL_Error: %s\n", SDL_GetError());
        return false;
    }

    window = SDL_CreateWindow("Car Racing Game",
                              SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
                              SCREEN_WIDTH, SCREEN_HEIGHT,
                              SDL_WINDOW_SHOWN);
    if (!window) {
        printf("Window could not be created! SDL_Error: %s\n", SDL_GetError());
        return false;
    }

    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    if (!renderer) {
        printf("Renderer could not be created! SDL_Error: %s\n", SDL_GetError());
        return false;
    }

    if (!(IMG_Init(IMG_INIT_PNG) & IMG_INIT_PNG)) {
        printf("SDL_image could not initialize! SDL_image Error: %s\n", IMG_GetError());
        return false;
    }

    if (TTF_Init() == -1) {
        printf("SDL_ttf could not initialize! SDL_ttf Error: %s\n", TTF_GetError());
        return false;
    }

    return true;
}

void Game::closeSDL() {
    SDL_DestroyTexture(carTexture);
    SDL_DestroyTexture(enemyTexture);
    SDL_DestroyTexture(trackTexture);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    IMG_Quit();
    TTF_Quit();
    SDL_Quit();
}

bool Game::loadTextures() {
    SDL_Surface* surface = IMG_Load("./car2.png"); // Path to car image
    if (!surface) {
        printf("Failed to load car image! SDL_image Error: %s\n", IMG_GetError());
        return false;
    }
    carTexture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_FreeSurface(surface);
    car = Car(SCREEN_WIDTH / 2 - 20, 3 * SCREEN_HEIGHT / 4, 5, carTexture);

    surface = IMG_Load("./barrier.png"); // Path to enemy image
    if (!surface) {
        printf("Failed to load enemy image! SDL_image Error: %s\n", IMG_GetError());
        return false;
    }
    enemyTexture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_FreeSurface(surface);

    surface = IMG_Load("road.png"); // Path to track image
    if (!surface) {
        printf("Failed to load track image! SDL_image Error: %s\n", IMG_GetError());
        return false;
    }
    trackTexture = SDL_CreateTextureFromSurface(renderer, surface);
    SDL_FreeSurface(surface);
    track = Track(trackTexture);

    return true;
}

bool Game::loadFont() {
    font = TTF_OpenFont("./fontGame.ttf", 24); // Path to font
    if (!font) {
        printf("Failed to load font! SDL_ttf Error: %s\n", TTF_GetError());
        return false;
    }
    return true;
}

void Game::run() {
    bool quit = false;
    SDL_Event e;
    srand(static_cast<unsigned>(time(0))); // Initialize random seed

    while (!quit) {
        handleEvents();
        update();
        render();
        SDL_Delay(15); // Delay for 15 milliseconds
    }

    closeSDL();
}

void Game::handleEvents() {
    SDL_Event e;
    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_QUIT) {
            exit(0);
        }

        if (e.type == SDL_KEYDOWN) {
            switch (e.key.keysym.sym) {
                case SDLK_o: // Press O to start the game
                    if (gameState == WAITING) {
                        gameState = PLAYING; // Start the game
                        createEnemies(6); // Create 6 enemies
                        lastSpeedIncreaseTime = SDL_GetTicks(); // Reset speed increase time
                        score = 0; // Reset score
                    }
                    break;

                case SDLK_a: // Move left
                    if (gameState == PLAYING) moveLeft = true;
                    break;
                case SDLK_d: // Move right
                    if (gameState == PLAYING) moveRight = true;
                    break;

                case SDLK_ESCAPE: // Press ESC to quit
                    if (gameState == GAME_OVER) exit(0);
                    break;

                case SDLK_r: // Press R to restart the game
                    if (gameState == GAME_OVER) {
                        resetGame(); // Reset the game
                        gameState = PLAYING; // Start the game
                    }
                    break;

                case SDLK_q: // Press Q to quit the game
                    if (gameState == GAME_OVER) exit(0);
                    break;
            }
        }

        if (e.type == SDL_KEYUP) {
            switch (e.key.keysym.sym) {
                case SDLK_a:
                    moveLeft = false;
                    break;
                case SDLK_d:
                    moveRight = false;
                    break;
            }
        }
    }
}

void Game::update() {
    if (gameState == WAITING) {
        // Waiting state logic
    } else if (gameState == PLAYING) {
        if (moveLeft) car.moveLeft();
        if (moveRight) car.moveRight();

        Uint32 currentTime = SDL_GetTicks();
        if (currentTime - lastSpeedIncreaseTime >= 5000) {
            ENEMY_SPEED++;
            lastSpeedIncreaseTime = currentTime;
        }

        track.move();

        for (auto& enemy : enemies) {
            enemy.move();
            if (enemy.getRect().y > SCREEN_HEIGHT) {
                enemy.reset(20 + (rand() % 3) * 200 + rand() % 100, -40);
                score++;
            }

            if (checkCollision(car.getRect(), enemy.getRect())) {
                gameState = GAME_OVER;
            }
        }
    } else if (gameState == GAME_OVER) {
        // Game over state logic
    }
}

void Game::render() {
    SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255); // Clear screen
    SDL_RenderClear(renderer);

    if (gameState == WAITING) {
        drawWaitingScreen();
    } else if (gameState == PLAYING) {
        track.draw(renderer);
        car.draw(renderer);

        for (auto& enemy : enemies) {
            enemy.draw(renderer);
        }

        updateScore();
    } else if (gameState == GAME_OVER) {
        drawGameOverScreen();
    }

    SDL_RenderPresent(renderer);
}

void Game::drawWaitingScreen() {
    SDL_Color white = {255, 255, 255};
    std::string message1 = "Press O to Start";
    std::string message2 = "Press 'A' or 'D' to go left or right";

    SDL_Surface* textSurface1 = TTF_RenderText_Solid(font, message1.c_str(), white);
    SDL_Texture* textTexture1 = SDL_CreateTextureFromSurface(renderer, textSurface1);
    SDL_Rect textRect1 = {SCREEN_WIDTH / 2 - textSurface1->w / 2, SCREEN_HEIGHT / 2 - textSurface1->h / 2, textSurface1->w, textSurface1->h};
    SDL_RenderCopy(renderer, textTexture1, NULL, &textRect1);

    SDL_Surface* textSurface2 = TTF_RenderText_Solid(font, message2.c_str(), white);
    SDL_Texture* textTexture2 = SDL_CreateTextureFromSurface(renderer, textSurface2);
    SDL_Rect textRect2 = {SCREEN_WIDTH / 2 - textSurface2->w / 2, SCREEN_HEIGHT / 2 + textSurface1->h / 2 + 10, textSurface2->w, textSurface2->h};
    SDL_RenderCopy(renderer, textTexture2, NULL, &textRect2);

    SDL_FreeSurface(textSurface1);
    SDL_DestroyTexture(textTexture1);
    SDL_FreeSurface(textSurface2);
    SDL_DestroyTexture(textTexture2);
}

void Game::drawGameOverScreen() {
    SDL_Color white = {255, 255, 255};
    std::string message1 = "Game Over";
    std::string message2 = "Score: " + std::to_string(score);
    std::string message3 = "Press R to Play Again or Q to Quit";

    SDL_Surface* textSurface1 = TTF_RenderText_Solid(font, message1.c_str(), white);
    SDL_Texture* textTexture1 = SDL_CreateTextureFromSurface(renderer, textSurface1);
    SDL_Rect textRect1 = {SCREEN_WIDTH / 2 - textSurface1->w / 2, SCREEN_HEIGHT / 2 - textSurface1->h / 2 - 40, textSurface1->w, textSurface1->h};

    SDL_Surface* textSurface2 = TTF_RenderText_Solid(font, message2.c_str(), white);
    SDL_Texture* textTexture2 = SDL_CreateTextureFromSurface(renderer, textSurface2);
    SDL_Rect textRect2 = {SCREEN_WIDTH / 2 - textSurface2->w / 2, SCREEN_HEIGHT / 2 - textSurface2->h / 2, textSurface2->w, textSurface2->h};

    SDL_Surface* textSurface3 = TTF_RenderText_Solid(font, message3.c_str(), white);
    SDL_Texture* textTexture3 = SDL_CreateTextureFromSurface(renderer, textSurface3);
    SDL_Rect textRect3 = {SCREEN_WIDTH / 2 - textSurface3->w / 2, SCREEN_HEIGHT / 2 - textSurface3->h / 2 + 40, textSurface3->w, textSurface3->h};

    SDL_RenderCopy(renderer, textTexture1, NULL, &textRect1);
    SDL_RenderCopy(renderer, textTexture2, NULL, &textRect2);
    SDL_RenderCopy(renderer, textTexture3, NULL, &textRect3);

    SDL_FreeSurface(textSurface1);
    SDL_DestroyTexture(textTexture1);
    SDL_FreeSurface(textSurface2);
    SDL_DestroyTexture(textTexture2);
    SDL_FreeSurface(textSurface3);
    SDL_DestroyTexture(textTexture3);
}

void Game::updateScore() {
    SDL_Color white = {255, 255, 255};
    SDL_Surface* textSurface = TTF_RenderText_Solid(font, ("Score: " + std::to_string(score)).c_str(), white);
    SDL_Texture* textTexture = SDL_CreateTextureFromSurface(renderer, textSurface);
    SDL_Rect textRect = {10, 10, textSurface->w, textSurface->h};

    SDL_RenderCopy(renderer, textTexture, NULL, &textRect);
    SDL_FreeSurface(textSurface);
    SDL_DestroyTexture(textTexture);
}

bool Game::checkCollision(SDL_Rect carRect, SDL_Rect enemyRect) {
    return SDL_HasIntersection(&carRect, &enemyRect);
}

void Game::createEnemies(int numEnemies) {
    for (int i = 0; i < numEnemies; ++i) {
        enemies.emplace_back(20 + (i % 3) * 200 + rand() % 100, -40 - (i * 100), enemyTexture);
    }
}

void Game::resetGame() {
    car = Car(SCREEN_WIDTH / 2 - 20, 3 * SCREEN_HEIGHT / 4, 5, carTexture);
    ENEMY_SPEED = 2;
    enemies.clear();
    createEnemies(6);
    lastSpeedIncreaseTime = SDL_GetTicks();
    score = 0;
}

int main(int argc, char* args[]) {
    Game game;
    if (!game.initSDL()) return -1;
    if (!game.loadTextures() || !game.loadFont()) return -1;
    game.run();
    return 0;
}
