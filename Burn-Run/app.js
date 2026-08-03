//  variables 
let score = 0;
let cross = true;
let gameLoop = null;
let nameplay = '';
let difficulty = null;

const diffSpeeds = {
    easy: 4,
    hard: 2
};


const msgs = 1500;


const startButton = document.getElementById('startButton');
const message = document.getElementById('message');
const inputContainer = document.getElementById('inputContainer');
const playerName = document.getElementById('playerName');
const submitNameButton = document.getElementById('submitNameButton');
const levels = document.getElementById('levels');
const level1Button = document.getElementById('level1Button');
const level2Button = document.getElementById('level2Button');
const gameContainer = document.getElementById('gameContainer');
const scoreCont = document.getElementById('scoreCont');
const gameOverMsg = document.getElementById('gameOverMsg');
const playAgainBtn = document.getElementById('playAgainBtn');
const introScreen = document.querySelector('.introScreen');
const introStep = document.querySelector('.introStep');
const instructions = document.querySelector('.instructions');


startButton.addEventListener('click', () => {
    startButton.hidden = true;
    inputContainer.hidden = false;
});

submitNameButton.addEventListener('click', () => {
    nameplay = playerName.value.trim();
    if (nameplay === '') {
        message.textContent = 'Please enter your name.';
        return;
    }
    message.textContent = `Welcome to Burn & Run, ${nameplay}!`;
    inputContainer.hidden = true;

    setTimeout(() => {
        message.textContent = '';
        levels.hidden = false;
    }, msgs);
});

level1Button.addEventListener('click', () => begin(nameplay, 'easy'));
level2Button.addEventListener('click', () => begin(nameplay, 'hard'));

function begin(name, level) {
    message.textContent = `${name}! You have selected ${level} level.`;
    levels.hidden = true;
    setTimeout(() => {
        message.textContent = '';
        startGame(level);
    }, msgs);
}



