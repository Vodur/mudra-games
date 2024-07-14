const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
let animationId;

let paddleWidth = 100;
let paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 4; // increased initial speed
let ballSpeedY = -4; // increased initial speed

let score = 0;
let isGameRunning = false;

document.addEventListener('mousemove', movePaddle);
startButton.addEventListener('click', startGame);

function resetGame() {
    score = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 4;
    ballSpeedY = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
    document.getElementById('score').textContent = score;
}

function startGame() {
    if (!isGameRunning) {
        resetGame();
        isGameRunning = true;
        startButton.textContent = 'Restart Game';
        draw();
    } else {
        cancelAnimationFrame(animationId);
        resetGame();
        isGameRunning = true;
        draw();
    }
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

function drawScore() {
    document.getElementById('score').textContent = score;
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
        } else {
            cancelAnimationFrame(animationId);
            isGameRunning = false;
            startButton.textContent = 'Start Game';
            alert('GAME OVER');
            resetGame();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawScore();
    updateBallPosition();
    if (isGameRunning) {
        animationId = requestAnimationFrame(draw);
    }
}
