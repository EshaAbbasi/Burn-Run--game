// variables
let score = 0;
let cross = true;
let gameLoop = null;
let timerInterval = null;
let nameplay = '';
let difficulty = null;
let timeLeft = 10;

const diffSpeeds = {
    easy: 4,
    hard: 2
};

const winScores = {
    easy: 10,
    hard: 15
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


playAgainBtn.addEventListener('click', () => {
    restart();
});

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
    const fireball2 = document.getElementById('fireball2');

    // Both fireballs get the animation + correct speed for the chosen difficulty
    [fireball, fireball2].forEach(fb => {
        fb.classList.add('fireballAni');
        fb.style.animationDuration = diffSpeeds[difficulty] + 's';
    });

    document.addEventListener('keydown', handleKeyPress);
    beginGameLoop();
    startTimer();
}

function handleKeyPress(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
    }

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

function startTimer() {
    timeLeft = 60;
    timerInterval = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (score < winScores[difficulty]) {
                endGame(false);
            }
        }
    }, 1000);
}

function checkCollision(character, fireball) {
    const charRect = character.getBoundingClientRect();
    const ballRect = fireball.getBoundingClientRect();

    const offsetX = Math.abs(charRect.left - ballRect.left);
    const offsetY = Math.abs(charRect.top - ballRect.top);

    return { hit: offsetX < 50 && offsetY < 50, near: offsetX < 120 };
}

function beginGameLoop() {
    gameLoop = setInterval(() => {
        const character = document.getElementById('character');
        const fireball = document.getElementById('fireball');
        const fireball2 = document.getElementById('fireball2');

        const result1 = checkCollision(character, fireball);
        const result2 = checkCollision(character, fireball2);

        if (result1.hit || result2.hit) {
            endGame(false);
            return;
        }

        if ((result1.near || result2.near) && cross) {
            score += 1;
            updateScore(score);
            cross = false;
            setTimeout(() => { cross = true; }, 1000);

            if (score >= winScores[difficulty]) {
                endGame(true);
            }
        }
    }, 10);
}

function endGame(won) {
    const fireball = document.getElementById('fireball');
    const fireball2 = document.getElementById('fireball2');

    clearInterval(gameLoop);
    clearInterval(timerInterval);
    document.removeEventListener('keydown', handleKeyPress);

    fireball.classList.remove('fireballAni');
    fireball2.classList.remove('fireballAni');

    if (won) {
        gameOverMsg.textContent = `You won the game, ${nameplay}!`;
        gameOverMsg.style.color = 'green';
    } else {
        gameOverMsg.textContent = `You lose the game, ${nameplay}!`;
        gameOverMsg.style.color = 'red';
    }

   
    playAgainBtn.classList.remove('hidden');
    playAgainBtn.hidden = false;
}

function updateScore(score) {
    scoreCont.textContent = 'your score is ' + score;
}

function restart() {
    const character = document.getElementById('character');
    const fireball = document.getElementById('fireball');
    const fireball2 = document.getElementById('fireball2');

    
    score = 0;
    cross = true;
    timeLeft = 60;
    updateScore(score);


    gameOverMsg.textContent = '';
    playAgainBtn.classList.add('hidden');
    character.style.top = '200px';

    clearInterval(gameLoop);
    clearInterval(timerInterval);

 
    [fireball, fireball2].forEach(fb => {
        fb.classList.remove('fireballAni');
    });
   
    void fireball.offsetWidth;
    void fireball2.offsetWidth;

    [fireball, fireball2].forEach(fb => {
        fb.classList.add('fireballAni');
        fb.style.animationDuration = diffSpeeds[difficulty] + 's';
    });

    document.addEventListener('keydown', handleKeyPress);
    beginGameLoop();
    startTimer();
}