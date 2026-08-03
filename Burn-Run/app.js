// variables 
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

function startGame(level) {
    difficulty = level; 

    introScreen.hidden = true;  
    introStep.hidden = true;
    instructions.hidden = true;
    gameContainer.hidden = false;
     const fireball = document.getElementById('fireball');
    fireball.classList.add('fireballAni');
    fireball.style.animationDuration = diffSpeeds[difficulty] + 's';
    document.addEventListener('keydown', handleKeyPress);
    beginGameLoop();
}

function handleKeyPress(e) {
    const character = document.getElementById('character');
    const playArea = document.getElementById('playArea');
    const moveStep = 25;

    const cy = parseInt(window.getComputedStyle(character, null).getPropertyValue('top'));
    const maxTop = playArea.clientHeight - character.offsetHeight;

    if (e.key === 'ArrowUp') {
        character.style.top = Math.max(0, cy - moveStep) + 'px';
    }
    if (e.key === 'ArrowDown') {
        character.style.top = Math.min(maxTop, cy + moveStep) + 'px';
    }
}

function beginGameLoop() {
    gameLoop = setInterval(() => {
        const character = document.getElementById('character');
        const fireball = document.getElementById('fireball');

        const charRect = character.getBoundingClientRect();
        const ballRect = fireball.getBoundingClientRect();

        const offsetX = Math.abs(charRect.left - ballRect.left);
        const offsetY = Math.abs(charRect.top - ballRect.top);

        if (offsetX < 50 && offsetY < 50) {
            gameOverMsg.textContent = `Game Over, ${nameplay}!`;
            fireball.classList.remove('fireballAni');
            playAgainBtn.classList.remove('hidden');

            clearInterval(gameLoop);
            document.removeEventListener('keydown', handleKeyPress);
        }
        else if (offsetX < 120 && cross) {
            score += 1;
            updateScore(score);
            cross = false;
            setTimeout(() => { cross = true; }, 1000);
        }
    }, 10);
}