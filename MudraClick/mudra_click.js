let score = 0;
let gameInterval;
let timeLeft = 30;
const gameArea = document.getElementById('gameArea');
const clickableObject = document.getElementById('clickableObject');
const scoreBoard = document.getElementById('scoreBoard');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const clickSound = document.getElementById('clickSound');
const endSound = document.getElementById('endSound');

function startGame() {
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    startButton.disabled = true;
    gameArea.classList.remove('hidden');
    scoreBoard.classList.remove('hidden');
    clickableObject.style.display = 'block';
    gameInterval = setInterval(updateGame, 1000);
    moveObject();
}

function updateGame() {
    if (timeLeft > 0) {
        timeLeft--;
        increaseDifficulty();
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    clickableObject.style.display = 'none';
    startButton.disabled = false;
    endSound.play();
    alert(`Game Over! Your score is ${score}`);
}

function moveObject() {
    const maxX = gameArea.clientWidth - clickableObject.clientWidth;
    const maxY = gameArea.clientHeight - clickableObject.clientHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    clickableObject.style.left = `${randomX}px`;
    clickableObject.style.top = `${randomY}px`;
}

function increaseDifficulty() {
    const newSize = Math.max(20, 50 - score / 2);
    clickableObject.style.width = `${newSize}px`;
    clickableObject.style.height = `${newSize}px`;
}

clickableObject.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    clickSound.play();
    increaseDifficulty();
    moveObject();
});

startButton.addEventListener('click', startGame);
