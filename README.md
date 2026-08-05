# Project Planning Deliverable: Burn & Run

## 1. Game Choice
* **Game Title:** Burn & Run
* **Game Concept:** The game will be built using HTML, CSS, and DOM-based JavaScript. The player controls a character image moving along a single axis (Up & Right/Left along a track) to avoid fireballs/Obstacles launched from a cannon (image) on the opposite side of the screen.there will be a background music which will play through out the game and a game over sound if the user collide.At first there will be an intro page and it will ask user for name,after user input it will ask about level of difficulty.after this the user can click on start and play the game.if the user pass the obstacles the score will increase by one,there will a min score that user needs to acheive within the time limit but if not he will lose and try again button will be displayed.
* **Game logo:**
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
* Up arrow  -> player(jump)
* Left arrow  -> player(Left)
* Right arrow  -> player(Right)

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
## 3.Technologies:
Html,css,js

## 4.Attributions:
assests:
image
charcter,canono,fireball
music:gameover,background
font:
language: 