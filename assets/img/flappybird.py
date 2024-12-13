+---------------------+
|        Car          |
+---------------------+
| - x: int            |
| - y: int            |
| - speed: int        |
| - texture: SDL_Texture* |
+---------------------+
| + Car(int, int, int, SDL_Texture*) |
| + moveLeft(): void   |
| + moveRight(): void  |
| + draw(SDL_Renderer*): void |
| + getRect(): SDL_Rect |
+---------------------+

+---------------------+
|       Enemy         |
+---------------------+
| - x: int            |
| - y: int            |
| - texture: SDL_Texture* |
| - active: bool      |
+---------------------+
| + Enemy(int, int, SDL_Texture*) |
| + move(): void      |
| + reset(int, int): void |
| + draw(SDL_Renderer*): void |
| + getRect(): SDL_Rect |
| + isActive(): bool   |
| + deactivate(): void |
+---------------------+

+---------------------+
|       Track         |
+---------------------+
| - texture: SDL_Texture* |
| - offsetY: int       |
+---------------------+
| + Track()           |
| + Track(SDL_Texture*) |
| + move(): void      |
| + draw(SDL_Renderer*): void |
+---------------------+

+---------------------+
|       Game          |
+---------------------+
| - window: SDL_Window* |
| - renderer: SDL_Renderer* |
| - carTexture: SDL_Texture* |
| - enemyTexture: SDL_Texture* |
| - trackTexture: SDL_Texture* |
| - font: TTF_Font*   |
| - car: Car          |
| - enemies: std::vector<Enemy> |
| - track: Track      |
| - score: int        |
| - moveLeft: bool    |
| - moveRight: bool   |
| - lastSpeedIncreaseTime: Uint32 |
| - gameState: GameState |
+---------------------+
| + Game()            |
| + initSDL(): bool   |
| + closeSDL(): void  |
| + loadTextures(): bool |
| + loadFont(): bool  |
| + run(): void       |
| + resetGame(): void |
| - handleEvents(): void |
| - update(): void    |
| - render(): void    |
| - drawWaitingScreen(): void |
| - drawGameOverScreen(): void |
| - updateScore(): void |
| - checkCollision(SDL_Rect, SDL_Rect): bool |
| - createEnemies(int): void |
+---------------------+

+---------------------+
|     GameState       |
+---------------------+
| WAITING             |
| PLAYING             |
| GAME_OVER           |
+---------------------+
