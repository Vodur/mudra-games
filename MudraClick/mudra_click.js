let score = 0;
let gameInterval;
let timeLeft = 30;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const clickSound = document.getElementById('clickSound');
const endSound = document.getElementById('endSound');
const gameInfo = document.getElementById('gameInfo');
const timeBar = document.getElementById('timeBar');

// Set fixed canvas size
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const initialSize = 50;
const sizeReductionFactor = 0.95; // Factor by which the size reduces with each score

const clickableObject = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    size: initialSize
};

function startGame() {
    score = 0;
    timeLeft = 30;
    clickableObject.size = initialSize; // Reset size
    startScreen.classList.add('hidden');
    gameOverElement.classList.add('hidden');

    const instructions = document.getElementById('instructions');
    instructions.classList.remove('hidden');

    setTimeout(() => {
        instructions.classList.add('hidden');
        canvas.classList.remove('hidden');
        gameInfo.classList.remove('hidden');
        gameInterval = setInterval(updateGame, 1000 / 30); // 30 FPS
        canvas.addEventListener('click', handleClick);
        updateGameInfo();
        drawObject();
    }, 5000);
}

function updateGame() {
    if (timeLeft > 0) {
        timeLeft -= 1 / 30;
        updateGameInfo();
        draw();
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    canvas.removeEventListener('click', handleClick);
    canvas.classList.add('hidden');
    gameInfo.classList.add('hidden');
    gameOverElement.classList.remove('hidden');
    finalScoreElement.textContent = score;
    endSound.play();
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const dx = clickX - clickableObject.x;
    const dy = clickY - clickableObject.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= clickableObject.size) {
        score++;
        clickSound.play();
        moveObject();
        drawObject();
        updateGameInfo();
    }
}

function moveObject() {
    const maxX = CANVAS_WIDTH - clickableObject.size * 2;
    const maxY = CANVAS_HEIGHT - clickableObject.size * 2;
    clickableObject.x = Math.random() * maxX + clickableObject.size;
    clickableObject.y = Math.random() * maxY + clickableObject.size;
    clickableObject.size *= sizeReductionFactor; // Reduce the size of the object
}

function drawObject() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawScore();
    ctx.beginPath();
    ctx.arc(clickableObject.x, clickableObject.y, clickableObject.size, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawScore() {
    ctx.font = "200px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; // Align text vertically to the middle
    ctx.fillText(score, canvas.width / 2, canvas.height / 2);
}

function updateGameInfo() {
    const timePercentage = timeLeft / 30;
    timeBar.style.transform = `scaleX(${timePercentage})`;
}

function restartGame() {
    gameOverElement.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

document.getElementById('startButton').addEventListener('click', startGame);
