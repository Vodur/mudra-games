const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const instructions = document.getElementById('instructions');
const menu = document.getElementById('menu');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let player, enemies = [], bullets = [], enemyBullets = [];
let score = 0;
let gameInterval;
let enemyFireInterval;
let allowMenuHide = false; // Flag to control menu visibility
let enemiesDirection = 1; // 1 for right, -1 for left

const playerImage = new Image();
playerImage.src = 'player.png';

const enemyImage = new Image();
enemyImage.src = 'enemy.png';

function setup() {
    player = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 60,
        width: 50,
        height: 50,
        speed: 5
    };

    enemies = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 11; j++) {
            enemies.push({
                x: 100 + j * 80,
                y: 50 + i * 80,
                width: 40,
                height: 40,
                dx: 2
            });
        }
    }

    bullets = [];
    enemyBullets = [];
    score = 0;
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawEnemyBullets() {
    enemyBullets.forEach(bullet => {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function updatePlayer(event) {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    player.x = mouseX - player.width / 2;

    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function updateEnemies() {
    const leftMost = Math.min(...enemies.map(e => e.x));
    const rightMost = Math.max(...enemies.map(e => e.x + e.width));

    if (leftMost <= 0 || rightMost >= canvas.width) {
        enemiesDirection *= -1;
        enemies.forEach(e => e.y += 20);
    }

    enemies.forEach(enemy => {
        enemy.x += enemy.dx * enemiesDirection;
    });
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function updateEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) {
            enemyBullets.splice(index, 1);
        }
    });
}

function collisionDetection() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1);
                    bullets.splice(bulletIndex, 1);
                    score += 10;
                }, 0);
            }
        });
    });

    enemyBullets.forEach((bullet, bulletIndex) => {
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            endGame();
        }
    });
}

function fireBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 5
    });
}

function enemyFire() {
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    if (randomEnemy) {
        enemyBullets.push({
            x: randomEnemy.x + randomEnemy.width / 2 - 2,
            y: randomEnemy.y + randomEnemy.height,
            width: 4,
            height: 10,
            speed: 3
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawBullets();
    drawEnemyBullets();
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function update() {
    updateEnemies();
    updateBullets();
    updateEnemyBullets();
    collisionDetection();
    draw();
}

function gameLoop() {
    update();
    if (enemies.length === 0) {
        endGame();
    }
}

function startGame() {
    setup();
    startScreen.classList.add('hidden');
    gameOverElement.classList.add('hidden');
    instructions.classList.remove('hidden');

    setTimeout(() => {
        instructions.classList.add('hidden');
        canvas.classList.remove('hidden');
        gameInterval = setInterval(gameLoop, 1000 / 60);
        enemyFireInterval = setInterval(enemyFire, 1000);
    }, 5000);
}

// Show menu for 2 seconds then hide it and allow mouse to control it
setTimeout(() => {
    menu.style.bottom = '-70px';
    allowMenuHide = true; // Enable menu hide by mouse movement
}, 2000);

function endGame() {
    clearInterval(gameInterval);
    clearInterval(enemyFireInterval);
    canvas.classList.add('hidden');
    gameOverElement.classList.remove('hidden');
    finalScoreElement.textContent = score;
    menu.classList.remove('hidden');
    allowMenuHide = false; // Disable menu hide by mouse movement on game end
}

function restartGame() {
    clearInterval(gameInterval);
    clearInterval(enemyFireInterval);
    bullets = [];
    enemyBullets = [];
    startScreen.classList.remove('hidden');
    gameOverElement.classList.add('hidden');
}

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

canvas.addEventListener('mousemove', updatePlayer);
canvas.addEventListener('click', fireBullet);

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
