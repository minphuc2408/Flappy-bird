import math
import os
from random import randint
from collections import deque

import pygame
from pygame.locals import *
FPS = 30
ANIMATION_SPEED = 0.18
WIN_WIDTH = 284 * 2
WIN_HEIGHT = 512

class Bird(pygame.sprite.Sprite):
    WIDTH = HEIGHT = 32
    SINK_SPEED = 0.18
    CLIMB_SPEED = 0.24
    CLIMB_DURATION = 250.3

    def __init__(self, x, y, msec_to_climb, images):
        super(Bird, self).__init__()
        self.x, self.y = x, y
        self.msec_to_climb = msec_to_climb
        self._img_wingup, self._img_wingdown = images
        self._mask_wingup = pygame.mask.from_surface(self._img_wingup)
        self._mask_wingdown = pygame.mask.from_surface(self._img_wingdown)

    def update(self, delta_frames=1):
        if self.msec_to_climb > 0:
            frac_climb_done = 1 - self.msec_to_climb/Bird.CLIMB_DURATION
            self.y -= (Bird.CLIMB_SPEED * frames_to_msec(delta_frames) *
                      (1 - math.cos(frac_climb_done * math.pi)))
            self.msec_to_climb -= frames_to_msec(delta_frames)
        else:
            self.y += Bird.SINK_SPEED * frames_to_msec(delta_frames)

    @property
    def image(self):
        if pygame.time.get_ticks() % 500 >= 250:
            return self._img_wingup
        else:
            return self._img_wingdown

    @property
    def mask(self):
        if pygame.time.get_ticks() % 500 >= 250:
            return self._mask_wingup
        else:
            return self._mask_wingdown

    @property
    def rect(self):
        return Rect(self.x, self.y, Bird.WIDTH, Bird.HEIGHT)

class Coin(pygame.sprite.Sprite):
    WIDTH = 50
    HEIGHT = 50

    def __init__(self, x, y, image):
        super(Coin, self).__init__()
        self.x, self.y = x, y
        self.image = image
        self.rect = self.image.get_rect(topleft=(x, y))
        self.mask = pygame.mask.from_surface(self.image)
        self.collected = False  # New flag to track if coin is collected

    def update(self, x, delta_frames=1):
        if not self.collected:  # Only update position if not collected
            self.x = x
            self.rect.topleft = (self.x, self.y)

    def collides_with(self, bird):
        if not self.collected:  # Only check collision if not collected
            return pygame.sprite.collide_mask(self, bird)
        return False

class PipePair(pygame.sprite.Sprite):
    WIDTH = 80
    PIECE_HEIGHT = 32
    ADD_INTERVAL = 3000

    def __init__(self, pipe_end_img, pipe_body_img, coin_img):
        super(PipePair, self).__init__()
        self.x = float(WIN_WIDTH - 1)
        self.score_counted = False
        self.coin_collected = False  # New flag to track coin collection

        self.image = pygame.Surface((PipePair.WIDTH, WIN_HEIGHT), SRCALPHA)
        self.image.convert()
        self.image.fill((0, 0, 0, 0))

        total_pipe_body_pieces = int(
            (WIN_HEIGHT - 4 * Bird.HEIGHT - 3 * PipePair.PIECE_HEIGHT) / PipePair.PIECE_HEIGHT
        )
        self.bottom_pieces = randint(1, total_pipe_body_pieces)
        self.top_pieces = total_pipe_body_pieces - self.bottom_pieces

        # Bottom pipe
        for i in range(1, self.bottom_pieces + 1):
            piece_pos = (0, WIN_HEIGHT - i * PipePair.PIECE_HEIGHT)
            self.image.blit(pipe_body_img, piece_pos)
        bottom_pipe_end_y = WIN_HEIGHT - self.bottom_height_px
        bottom_end_piece_pos = (0, bottom_pipe_end_y - PipePair.PIECE_HEIGHT)
        self.image.blit(pipe_end_img, bottom_end_piece_pos)

        # Top pipe
        for i in range(self.top_pieces):
            self.image.blit(pipe_body_img, (0, i * PipePair.PIECE_HEIGHT))
        top_pipe_end_y = self.top_height_px
        self.image.blit(pipe_end_img, (0, top_pipe_end_y))

        self.top_pieces += 1
        self.bottom_pieces += 1

        # Add coin between pipes
        gap_height = bottom_pipe_end_y - self.top_height_px
        coin_y = self.top_height_px + (gap_height - Coin.HEIGHT) // 2
        self.coin = Coin(self.x + PipePair.WIDTH / 2 - Coin.WIDTH / 2, coin_y, coin_img)

        self.mask = pygame.mask.from_surface(self.image)

    @property
    def top_height_px(self):
        return self.top_pieces * PipePair.PIECE_HEIGHT

    @property
    def bottom_height_px(self):
        return self.bottom_pieces * PipePair.PIECE_HEIGHT

    @property
    def visible(self):
        return -PipePair.WIDTH < self.x < WIN_WIDTH

    @property
    def rect(self):
        return Rect(self.x, 0, PipePair.WIDTH, PipePair.PIECE_HEIGHT)

    def update(self, delta_frames=1):
        self.x -= ANIMATION_SPEED * frames_to_msec(delta_frames)
        self.coin.update(self.x + PipePair.WIDTH / 2 - Coin.WIDTH / 2, delta_frames)

    def collides_with(self, bird):
        return pygame.sprite.collide_mask(self, bird)

    def collides_with_coin(self, bird):
        if not self.coin_collected and self.coin.collides_with(bird):
            self.coin.collected = True
            self.coin_collected = True
            return True
        return False

def load_images():
    def load_image(img_file_name):
        file_name = os.path.join(os.path.dirname(__file__), 'images', img_file_name)
        img = pygame.image.load(file_name)
        img.convert()
        return img

    images = {
        'background': load_image('background.png'),
        'pipe-end': load_image('pipe_end.png'),
        'pipe-body': load_image('pipe_body.png'),
        'bird-wingup': load_image('bird_wing_up.png'),
        'bird-wingdown': load_image('bird_wing_down.png'),
        'coin': load_image('coin.png')
    }

    images['coin'] = pygame.transform.scale(images['coin'], (Coin.WIDTH, Coin.HEIGHT))
    return images

def frames_to_msec(frames, fps=FPS):
    return 1000.0 * frames / fps

def msec_to_frames(milliseconds, fps=FPS):
    return fps * milliseconds / 1000.0

def main():
    pygame.init()

    display_surface = pygame.display.set_mode((WIN_WIDTH, WIN_HEIGHT))
    pygame.display.set_caption('Pygame Flappy Bird')

    clock = pygame.time.Clock()
    score_font = pygame.font.SysFont(None, 32, bold=True)
    images = load_images()

    bird = Bird(50, int(WIN_HEIGHT/2 - Bird.HEIGHT/2), 2,
                (images['bird-wingup'], images['bird-wingdown']))

    pipes = deque()
    score = 0
    done = paused = False

    frame_clock = 0
    while not done:
        clock.tick(FPS)

        if not (paused or frame_clock % msec_to_frames(PipePair.ADD_INTERVAL)):
            pp = PipePair(images['pipe-end'], images['pipe-body'], images['coin'])
            pipes.append(pp)

        for e in pygame.event.get():
            if e.type == QUIT or (e.type == KEYUP and e.key == K_ESCAPE):
                done = True
                break
            elif e.type == KEYUP and e.key in (K_PAUSE, K_p):
                paused = not paused
            elif e.type == MOUSEBUTTONUP or (e.type == KEYUP and
                    e.key in (K_UP, K_RETURN, K_SPACE)):
                bird.msec_to_climb = Bird.CLIMB_DURATION

        if paused:
            continue

        pipe_collision = any(p.collides_with(bird) for p in pipes)
        if pipe_collision or 0 >= bird.y or bird.y >= WIN_HEIGHT - Bird.HEIGHT:
            done = True

        for x in (0, WIN_WIDTH / 2):
            display_surface.blit(images['background'], (x, 0))

        while pipes and not pipes[0].visible:
            pipes.popleft()

        for p in pipes:
            p.update()
            display_surface.blit(p.image, p.rect)
            
            # Only draw coin if not collected
            if not p.coin_collected:
                display_surface.blit(p.coin.image, p.coin.rect)
            
            # Check for coin collision
            if p.collides_with_coin(bird):
                score += 1

        bird.update()
        display_surface.blit(bird.image, bird.rect)

        score_surface = score_font.render(str(score), True, (255, 255, 255))
        score_x = WIN_WIDTH/2 - score_surface.get_width()/2
        display_surface.blit(score_surface, (score_x, PipePair.PIECE_HEIGHT))

        pygame.display.flip()
        frame_clock += 1

    print('Game over! Score: %i' % score)
    pygame.quit()

if __name__ == '__main__':
    main()