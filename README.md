# Project Planning Deliverable: Burn & Run

## 1. Game Choice
* **Game Title:** Burn & Run
* **Game Concept:** The game will be built using HTML, CSS, and DOM-based JavaScript. The player controls a character image moving along a single axis (Up and Down along a track) to avoid fireballs launched from a cannon (image) on the opposite side of the screen.
* **Modes:**
  * **Easy Mode:** Standard fireball speed and spawn interval along the player's line.
  * **Hard Mode:** Adds obstacles on the path and fireball together.

## 2. Pseudocode for Overall Gameplay

**SETUP:**
* Get player, cannon, track, scoreboard from page
* Player, speed
* Score = 0, gameOver = false
* Mode = "EASY", "HARD"
* Fireballs = [], obstacles = []

**MOVE PLAYER (on key press):**
* Up arrow / W -> player(jump)

**SPAWN FIREBALL (cannon fires):**
* If game is over -> stop
* Create fireball at cannon's position
* Add it to the track and to fireballs list

**GAME LOOP (runs every frame):**
* If game is over -> stop
* For each fireball:
  * Push it left, toward the player
  * If it touches the player -> GAME OVER
  * If it flies off screen -> remove it, +10 score
* If mode is HARD:
  * For each obstacle:
    * If player touches it -> GAME OVER
* Repeat loop next frame

**CHECK COLLISION (elementA, elementB):**
* Compare their edges (top/bottom/left/right)
* Return true if they overlap

**GAME OVER:**
* Freeze the game, show final score

**RESET:**
* Clear fireballs, reset player position and score
* Start loop again
