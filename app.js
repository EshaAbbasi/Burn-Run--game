// ---------- state ----------
let score = 0;
let cross = true;
let gameLoop = null;
let timerInterval = null;
let holdInterval = null;
let nameplay = '';
let difficulty = null;
let timeLeft = 60;
let running = false;
let muted = false;
let drag = null;

const GAME_SECONDS = 60;
const msgs = 1500;

const diffSpeeds = { easy: 2, hard: 1.5 };
const winScores = { easy: 15, hard: 20 };

// ---------- audio ----------
const musicbg = new Audio('music.mp3');
musicbg.loop = true;
const musicover = new Audio('over.wav');

// Browsers (especially phones) only allow audio after a tap, so music
// starts from the Start button instead of a timer.
function startMusic() {
    if (!muted) musicbg.play().catch(() => {});
}

// ---------- elements ----------
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
const timerCont = document.getElementById('timerCont');
const soundBtn = document.getElementById('soundBtn');
const playArea = document.getElementById('playArea');
const character = document.getElementById('character');
const gameOver = document.getElementById('gameOver');
const gameOverMsg = document.getElementById('gameOverMsg');
const playAgainBtn = document.getElementById('playAgainBtn');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const contentCard = document.querySelector('.content-card');

const fireballIds = ['fireball', 'fireball2', 'fireball3', 'fireball4', 'fireball5'];
const fireballs = fireballIds.map(id => document.getElementById(id));

// ---------- intro flow ----------
startButton.addEventListener('click', () => {
    startButton.hidden = true;
    inputContainer.hidden = false;
    startMusic();
    playerName.focus();
});

function submitName() {
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
}

submitNameButton.addEventListener('click', submitName);
playerName.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitName();
});

level1Button.addEventListener('click', () => begin(nameplay, 'easy'));
level2Button.addEventListener('click', () => begin(nameplay, 'hard'));
playAgainBtn.addEventListener('click', startRound);

soundBtn.addEventListener('click', () => {
    muted = !muted;
    musicbg.muted = muted;
    musicover.muted = muted;
    soundBtn.textContent = muted ? 'Sound off' : 'Sound on';
    if (!muted && running) startMusic();
});

function begin(name, level) {
    message.textContent = `${name}! You have selected ${level} level.`;
    levels.hidden = true;
    setTimeout(() => {
        message.textContent = '';
        startGame(level);
    }, msgs);
}

// ---------- fireballs ----------
// Positions are percentages of the arena height, so they stay correct
// on any screen size.
function randomizeTop(el) {
    const h = playArea.clientHeight;
    if (!h) return;
    const maxPct = 100 - (el.offsetHeight / h) * 100;
    el.style.top = (Math.random() * maxPct) + '%';
}

fireballs.forEach(fb => {
    fb.addEventListener('animationiteration', () => randomizeTop(fb));
});

// ---------- starting a round ----------
function startGame(level) {
    difficulty = level;
    contentCard.hidden = true;
    gameContainer.hidden = false;
    startRound();
}

function startRound() {
    score = 0;
    cross = true;
    timeLeft = GAME_SECONDS;
    updateScore();
    updateTimer();

    gameOver.hidden = true;
    gameOverMsg.textContent = '';
    gameOverMsg.classList.remove('win', 'lose');

    character.style.top = '';          // back to the CSS start position

    fireballs.forEach(fb => {
        fb.classList.remove('fireballAni');
        void fb.offsetWidth;           // restart the animation
        fb.style.animationPlayState = 'running';
        fb.style.animationDuration = diffSpeeds[difficulty] + 's';
        randomizeTop(fb);
        fb.classList.add('fireballAni');
    });

    musicover.pause();
    musicover.currentTime = 0;
    startMusic();

    running = true;
    document.addEventListener('keydown', handleKeyPress);
    beginGameLoop();
    startTimer();
}

// ---------- controls: keyboard, drag, on-screen buttons ----------
function setTop(px) {
    const h = playArea.clientHeight;
    const maxTop = h - character.offsetHeight;
    const y = Math.min(maxTop, Math.max(0, px));
    character.style.top = (y / h * 100) + '%';
}

function moveBy(dy) {
    setTop(character.offsetTop + dy);
}

function handleKeyPress(e) {
    const up = e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W';
    const down = e.key === 'ArrowDown' || e.key === 's' || e.key === 'S';
    if (!up && !down) return;

    e.preventDefault();
    const step = playArea.clientHeight * 0.0625;
    moveBy(up ? -step : step);
}

// Drag anywhere in the arena (finger or mouse). The player follows the
// movement, so your finger doesn't have to sit on top of the character.
playArea.addEventListener('pointerdown', e => {
    if (!running) return;
    drag = { y: e.clientY, top: character.offsetTop };
    playArea.setPointerCapture(e.pointerId);
});

playArea.addEventListener('pointermove', e => {
    if (!drag || !running) return;
    setTop(drag.top + (e.clientY - drag.y));
});

['pointerup', 'pointercancel'].forEach(type => {
    playArea.addEventListener(type, () => { drag = null; });
});

// Hold-to-move buttons for touch screens
function stopHold() {
    clearInterval(holdInterval);
    holdInterval = null;
}

function holdToMove(btn, dir) {
    btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (!running) return;
        stopHold();
        const tick = () => moveBy(dir * playArea.clientHeight * 0.018);
        tick();
        holdInterval = setInterval(tick, 16);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(type => {
        btn.addEventListener(type, stopHold);
    });
    btn.addEventListener('contextmenu', e => e.preventDefault());
}

holdToMove(upBtn, -1);
holdToMove(downBtn, 1);

// ---------- timer ----------
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft -= 1;
        updateTimer();
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// ---------- game loop ----------
function beginGameLoop() {
    clearInterval(gameLoop);
    gameLoop = setInterval(() => {
        const charRect = character.getBoundingClientRect();

        // Forgiving hit box: shrink the sprite by a fraction of its size
        // (not fixed pixels) so it still works when scaled down on phones.
        const padX = charRect.width * 0.25;
        const padY = charRect.height * (15 / 90);
        const hitBox = {
            left: charRect.left + padX,
            right: charRect.right - padX,
            top: charRect.top + padY,
            bottom: charRect.bottom - padY
        };

        let anyHit = false;
        let anyNear = false;

        fireballs.forEach(fb => {
            const ballRect = fb.getBoundingClientRect();

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
            updateScore();
            cross = false;
            setTimeout(() => { cross = true; }, 1000);

            if (score >= winScores[difficulty]) {
                endGame(true);
            }
        }
    }, 16);
}

// ---------- end of round ----------
function endGame(won) {
    if (!running) return;
    running = false;

    clearInterval(gameLoop);
    clearInterval(timerInterval);
    stopHold();
    drag = null;
    document.removeEventListener('keydown', handleKeyPress);

    // freeze the fireballs where they are
    fireballs.forEach(fb => { fb.style.animationPlayState = 'paused'; });

    gameOverMsg.classList.remove('win', 'lose');

    if (won) {
        gameOverMsg.textContent = `You won the game, ${nameplay}!`;
        gameOverMsg.classList.add('win');
    } else {
        gameOverMsg.textContent = `You lose the game, ${nameplay}!`;
        gameOverMsg.classList.add('lose');
        musicbg.pause();
        if (!muted) musicover.play().catch(() => {});
    }

    gameOver.hidden = false;
    playAgainBtn.focus({ preventScroll: true });
}

// ---------- HUD ----------
function updateScore() {
    scoreCont.textContent = `Score ${score} / ${winScores[difficulty]}`;
}

function updateTimer() {
    timerCont.textContent = `${Math.max(timeLeft, 0)}s`;
}
