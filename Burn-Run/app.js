// ---- variables ----
let nameplay = '';

// how long a status message stays on screen before we move to the next step
const msgdelay = 1500;

// ---- element references (all fixed: no stray '.' or '#' in getElementById) ----
const startButton = document.getElementById('startButton');
const message = document.getElementById('message');

const inputContainer = document.getElementById('inputContainer');
const playerName = document.getElementById('playerName');
const submitNameButton = document.getElementById('submitNameButton');

const levels = document.getElementById('levels');
const level1Button = document.getElementById('level1Button');
const level2Button = document.getElementById('level2Button');

const gameContainer = document.getElementById('gameContainer');
const score = document.getElementById('score');
const gameOver = document.getElementById('gameOver');

// the intro bits we want to hide once the game actually starts
const introScreen = document.querySelector('.introScreen');
const introStep = document.querySelector('.introStep');
const instructions = document.querySelector('.instructions');

// ---- Step 1: Start Game -> show name entry ----
startButton.addEventListener('click', () => {
    startButton.hidden = true;
    inputContainer.hidden = false;
});

// ---- Step 2: Submit name -> welcome message -> show levels ----
submitNameButton.addEventListener('click', () => {
    nameplay = playerName.value.trim();

    if (nameplay === '') {
        message.textContent = 'Please enter your name.';
        return; // stay on this step until they actually type a name
    }

    message.textContent = `Welcome to Burn & Run, ${nameplay}!`;
    inputContainer.hidden = true;

    setTimeout(() => {
        message.textContent = '';
        levels.hidden = false;
    },  msgdelay);
});

// ---- Step 3: Choose level -> level message -> start game ----
level1Button.addEventListener('click', () => begin(nameplay, 'easy'));
level2Button.addEventListener('click', () => begin(nameplay, 'hard'));

function begin(name, level) {
    message.textContent = `${name}! You have selected ${level} level.`;
    levels.hidden = true;

    setTimeout(() => {
        message.textContent = '';
        startGame(level);
    },  msgdelay);
}

function startGame(level) {
    // hide all the intro/menu text, leave only the game (score) visible
    introScreen.hidden = true;
    introStep.hidden = true;
    instructions.hidden = true;

    gameContainer.hidden = false;
    score.textContent = 'Score: 0';

    // ---- your game logic goes here ----
    // e.g. use `level` ('easy' | 'hard') to control fireball speed/spawn rate
}