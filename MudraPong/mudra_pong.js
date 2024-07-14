const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const gameInfo = document.getElementById('gameInfo');
const scoreElement = document.getElementById('score');
let animationId;

let paddleWidth = 100;
let paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 4;
let ballSpeedY = -4;

let score = 0;
let isGameRunning = false;

document.addEventListener('mousemove', movePaddle);

function resetGame() {
    score = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 4;
    ballSpeedY = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
    updateScore();
}

function startGame() {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    canvas.classList.remove('hidden');
    gameInfo.classList.remove('hidden');
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;
    resetGame();
    isGameRunning = true;
    draw();
}

function movePaddle(event) {
    const relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function updateBallPosition() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballSpeedY > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
            score++;
            ballSpeedX *= 1.1;
            ballSpeedY *= 1.1;
            updateScore();
        } else {
            isGameRunning = false;
            cancelAnimationFrame(animationId);
            gameOver();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    updateBallPosition();
    if (isGameRunning) {
        animationId = requestAnimationFrame(draw);
    }
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function gameOver() {
    canvas.classList.add('hidden');
    gameInfo.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = score;
}

function restartGame() {
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.menuButton').addEventListener('click', startGame);
});
