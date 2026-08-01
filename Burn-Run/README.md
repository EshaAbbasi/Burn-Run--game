# Project Planning Deliverable:Burn & Run

## 1. Game Choice
* **Game Title:**Burn & Run
* **Game Concept:** The game will be built using HTML, CSS, and DOM-based JavaScript. The player controls a character image moving along a single axis (Up and Down along a track) to avoid fireballs launched from a cannon(image) on the opposite side of the screen.
* **Modes:**
  * **Easy Mode:** Standard fireball speed and spawn interval along the player's line.
  * **Hard Mode:** Adds obstacles on the patyh and fireball together. 

---

## 2. Pseudocode for Overall Gameplay

==========================================
BURN & RUN — GAME LOGIC
==========================================

SETUP:
    Get player, cannon, track, scoreboard from page
    player, speed 
    score = 0, gameOver = false
    mode = "EASY" ,"Hard"
    fireballs = [], obstacles = []

MOVE PLAYER (on key press):
    UP arrow / W -> player(jump)
   

SPAWN FIREBALL (cannon fires):
    IF game is over -> stop
    Create fireball at cannon's position
    Add it to the track and to fireballs list

GAME LOOP (runs every frame):
    IF game is over -> stop

    FOR each fireball:
        Push it left, toward the player
        IF it touches the player -> GAME OVER
        IF it flies off screen -> remove it, +10 score

    IF mode is HARD:
        FOR each obstacle:
            IF player touches it -> GAME OVER

    Repeat loop next frame

CHECK COLLISION (elementA, elementB):
    Compare their edges (top/bottom/left/right)
    Return true if they overlap

GAME OVER:
    Freeze the game, show final score

RESET:
    Clear fireballs, reset player position and score
    Start loop again