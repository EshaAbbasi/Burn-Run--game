let score = 0;
let cross = true;
let gameLoop = null;
let timerInterval = null;
let nameplay = '';
let difficulty = null;
let timeLeft = 10;

const diffSpeeds = {
    easy: 2,
    hard: 1.5
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


const fireballIds = ['fireball', 'fireball2', 'fireball3', 'fireball4', 'fireball5'];

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

function randomizeTop(el) {
    const playArea = document.getElementById('playArea');
    const maxTop = playArea.clientHeight - el.offsetHeight;
    const newTop = Math.floor(Math.random() * maxTop);
    el.style.top = newTop + 'px';
}

function startGame(level) {
    difficulty = level;

    introScreen.hidden = true;
    introStep.hidden = true;
    instructions.hidden = true;
    gameContainer.hidden = false;

    fireballIds.forEach(id => {
        const fireball = document.getElementById(id);
        fireball.classList.add('fireballAni');
        fireball.style.animationDuration = diffSpeeds[difficulty] + 's';

        randomizeTop(fireball);
        fireball.addEventListener('animationiteration', () => randomizeTop(fireball));
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

function beginGameLoop() {
    gameLoop = setInterval(() => {
        const character = document.getElementById('character');
        const charRect = character.getBoundingClientRect();

      
        const CHAR_PAD_X = 30;
        const CHAR_PAD_Y = 15;
        const hitBox = {
            left: charRect.left + CHAR_PAD_X,
            right: charRect.right - CHAR_PAD_X,
            top: charRect.top + CHAR_PAD_Y,
            bottom: charRect.bottom - CHAR_PAD_Y
        };

        let anyHit = false;
        let anyNear = false;

        fireballIds.forEach(id => {
            const fireball = document.getElementById(id);
            const ballRect = fireball.getBoundingClientRect();

          
            const hit = hitBox.left < ballRect.right && hitBox.right > ballRect.left &&
                        hitBox.top < ballRect.bottom && hitBox.bottom > ballRect.top;

            const near = charRect.left < ballRect.right && charRect.right > ballRect.left;

            if (hit) anyHit = true;
            if (near) anyNear = true;
        });

        if (anyHit) {
            endGame(false);
            return;
        }

        if (anyNear && cross) {
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
    clearInterval(gameLoop);
    clearInterval(timerInterval);
    document.removeEventListener('keydown', handleKeyPress);

    fireballIds.forEach(id => {
        document.getElementById(id).classList.remove('fireballAni');
    });

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

    score = 0;
    cross = true;
    timeLeft = 60;
    updateScore(score);

    gameOverMsg.textContent = '';
    playAgainBtn.classList.add('hidden');
    character.style.top = '200px';

    clearInterval(gameLoop);
    clearInterval(timerInterval);

    fireballIds.forEach(id => {
        const fireball = document.getElementById(id);
        fireball.classList.remove('fireballAni');
        void fireball.offsetWidth;
        fireball.classList.add('fireballAni');
        fireball.style.animationDuration = diffSpeeds[difficulty] + 's';
        randomizeTop(fireball);
    });

    document.addEventListener('keydown', handleKeyPress);
    beginGameLoop();
    startTimer();
}