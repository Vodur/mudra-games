const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const instructionsScreen = document.getElementById('instructions');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const scoreDisplay = document.getElementById('score');
let animationId;

let paddleWidth = 150;
let paddleHeight = 15;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 4;
let ballSpeedY = -4;

let score = 0;
let isGameRunning = false;
let isHighSpeed = false;
let allowMenuHide = false; // Flag to control menu visibility

// Show menu for 2 seconds then hide it and allow mouse to control it
setTimeout(() => {
	menu.style.bottom = '-70px';
	allowMenuHide = true; // Enable menu hide by mouse movement
}, 2000);

document.addEventListener('mousemove', movePaddle);
canvas.addEventListener('click', toggleSpeed);

function resetGame() {
    score = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 4;
    ballSpeedY = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
}

function showInstructions() {
    startScreen.classList.add('hidden');
    instructionsScreen.classList.remove('hidden');
    setTimeout(() => {
        instructionsScreen.classList.add('hidden');
        startGame();
    }, 5000);
}

function startGame() {
    gameOverScreen.classList.add('hidden');
    canvas.classList.remove('hidden');
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

function toggleSpeed() {
    isHighSpeed = !isHighSpeed;
    if (isHighSpeed) {
        ballSpeedX *= 1.5;
        ballSpeedY *= 1.5;
    } else {
        ballSpeedX /= 1.5;
        ballSpeedY /= 1.5;
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}

function updateBallPosition() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > canvas.height - paddleHeight) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
            const hitPoint = ((ballX - paddleX) / paddleWidth) - 0.5;
            ballSpeedX = ballSpeedX + hitPoint * 8; // Add some angle based on where the ball hits the paddle
            score++;
            ballSpeedX *= 1.1;
            ballSpeedY *= 1.1;
            scoreDisplay.textContent = score;
        } else if (ballY + ballRadius > canvas.height) {
            isGameRunning = false;
            cancelAnimationFrame(animationId);
            gameOver();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawPaddle();
    drawBall();
    updateBallPosition();
    if (isGameRunning) {
        animationId = requestAnimationFrame(draw);
    }
}

function drawScore() {
    ctx.font = "200px 'Comic Sans MS', cursive, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score, canvas.width / 2, canvas.height / 2);
}

function gameOver() {
    canvas.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = score;
}

function restartGame() {
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

document.getElementById('startButton').addEventListener('click', showInstructions);

// Mouse position tracking for menu hover effect
document.addEventListener('mousemove', (event) => {
    if (!allowMenuHide) return; // Skip if not allowed to hide the menu

    const menuRect = menu.getBoundingClientRect();
    const distance = Math.abs(event.clientY - menuRect.top);
    
    if (distance < 80) { // Adjust the distance threshold as needed
        menu.style.bottom = '0';
    } else {
        menu.style.bottom = '-70px'; // Ensure this matches the CSS value
    }
});
