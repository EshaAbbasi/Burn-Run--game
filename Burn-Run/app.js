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
    const fireball3 = document.getElementById('fireball3');

    fireball.classList.add('fireballAni');
    fireball.style.animationDuration = diffSpeeds[difficulty] + 's';

    fireball2.classList.add('fireballAni');
    fireball2.style.animationDuration = diffSpeeds[difficulty] + 's';

    fireball3.classList.add('fireballAni');
    fireball3.style.animationDuration = diffSpeeds[difficulty] + 's';

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

function beginGameLoop() {
    gameLoop = setInterval(() => {
        const character = document.getElementById('character');
        const fireball = document.getElementById('fireball');
        const fireball2 = document.getElementById('fireball2');
        const fireball3 = document.getElementById('fireball3');

        const charRect = character.getBoundingClientRect();

        const ballRect1 = fireball.getBoundingClientRect();
        const offsetX1 = Math.abs(charRect.left - ballRect1.left);
        const offsetY1 = Math.abs(charRect.top - ballRect1.top);
        const hit1 = offsetX1 < 90 && offsetY1 < 40;
        const near1 = offsetX1 < 120;

        const ballRect2 = fireball2.getBoundingClientRect();
        const offsetX2 = Math.abs(charRect.left - ballRect2.left);
        const offsetY2 = Math.abs(charRect.top - ballRect2.top);
        const hit2 = offsetX2 < 90 && offsetY2 < 40;
        const near2 = offsetX2 < 120;

        const ballRect3 = fireball3.getBoundingClientRect();
        const offsetX3 = Math.abs(charRect.left - ballRect3.left);
        const offsetY3 = Math.abs(charRect.top - ballRect3.top);
        const hit3 = offsetX3 < 90 && offsetY3 < 40;
        const near3 = offsetX3 < 120;

        if (hit1 || hit2 || hit3) {
            endGame(false);
            return;
        }

        if ((near1 || near2 || near3) && cross) {
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
    const fireball3 = document.getElementById('fireball3');

    clearInterval(gameLoop);
    clearInterval(timerInterval);
    document.removeEventListener('keydown', handleKeyPress);

    fireball.classList.remove('fireballAni');
    fireball2.classList.remove('fireballAni');
        fireball3.classList.remove('fireballAni');

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
    const fireball3 = document.getElementById('fireball3');

    score = 0;
    cross = true;
    timeLeft = 60;
    updateScore(score);


    gameOverMsg.textContent = '';
    playAgainBtn.classList.add('hidden');
    character.style.top = '200px';

    clearInterval(gameLoop);
    clearInterval(timerInterval);

    fireball.classList.remove('fireballAni');
    fireball2.classList.remove('fireballAni');
    fireball3.classList.remove('fireballAni');

    void fireball.offsetWidth;
    void fireball2.offsetWidth;
        void fireball3.offsetWidth;

    fireball.classList.add('fireballAni');
    fireball.style.animationDuration = diffSpeeds[difficulty] + 's';

    fireball2.classList.add('fireballAni');
    fireball2.style.animationDuration = diffSpeeds[difficulty] + 's';

    fireball3.classList.add('fireballAni');
    fireball3.style.animationDuration = diffSpeeds[difficulty] + 's';

    document.addEventListener('keydown', handleKeyPress);
    beginGameLoop();
    startTimer();
}