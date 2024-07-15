const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverElement = document.getElementById('gameOver');
const gameOverMessage = document.getElementById('gameOverMessage');

let CANVAS_WIDTH = window.innerWidth * 0.8;
let CANVAS_HEIGHT = window.innerHeight * 0.8;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

function updateSpeedScale() {
    return CANVAS_WIDTH / 800;
}

let SPEED_SCALE = updateSpeedScale();
let SHOT_SPEED = 10 * SPEED_SCALE;
let playerHealth = 5;
let enemySpeed = 4 * SPEED_SCALE;
let enemyShootIntervalBase = 1000;
let allowMenuHide = false; // Flag to control menu visibility

// Show menu for 2 seconds then hide it and allow mouse to control it
setTimeout(() => {
	menu.style.bottom = '-70px';
	allowMenuHide = true; // Enable menu hide by mouse movement
}, 2000);

class Player {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.color = color;
        this.health = playerHealth;
        this.maxHealth = playerHealth;
        this.targetX = x;
    }

    update(mouse) {
        this.targetX = mouse.x;
        if (this.targetX < this.size) this.targetX = this.size;
        if (this.targetX > canvas.width - this.size) this.targetX = canvas.width - this.size;

        this.x += (this.targetX - this.x) * 0.1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (this.health / this.maxHealth), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    getBoundingBox() {
        return {
            left: this.x - this.size,
            right: this.x + this.size,
            top: this.y - this.size,
            bottom: this.y + this.size,
        };
    }
}

class Enemy {
    constructor() {
        this.x = canvas.width / 2;
        this.y = 30;
        this.size = 20;
        this.color = 'red';
        this.health = 5;
        this.maxHealth = 5;
        this.speed = enemySpeed;
        this.shootInterval = this.getRandomShootInterval();
        this.lastShotTime = Date.now();
        this.directionChangeInterval = this.getRandomShootInterval();
        this.lastDirectionChangeTime = Date.now();
        this.dx = Math.random() < 0.5 ? -this.speed : this.speed;
        this.targetX = this.x;
    }

    getRandomShootInterval() {
        return Math.random() * 500 + enemyShootIntervalBase;
    }

    update() {
        const now = Date.now();
        if (now - this.lastDirectionChangeTime > this.directionChangeInterval) {
            this.dx = Math.random() < 0.5 ? -this.speed : this.speed;
            this.lastDirectionChangeTime = now;
        }

        this.targetX += this.dx;

        if (this.targetX < this.size || this.targetX > canvas.width - this.size) {
            this.dx = -this.dx;
            this.targetX += this.dx;
        }

        this.x += (this.targetX - this.x) * 0.1;

        this.shoot();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (this.health / this.maxHealth), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShotTime > this.shootInterval) {
            const angle = Math.PI / 2;
            const dx = Math.cos(angle) * SHOT_SPEED;
            const dy = Math.sin(angle) * SHOT_SPEED;
            enemyShots.push(new Shot(this.x, this.y, dx, dy));
            this.lastShotTime = now;
            this.shootInterval = this.getRandomShootInterval();
        }
    }

    getBoundingBox() {
        return {
            left: this.x - this.size,
            right: this.x + this.size,
            top: this.y - this.size,
            bottom: this.y + this.size,
        };
    }
}

class Shot {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = 5;
        this.color = 'yellow';
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    getBoundingBox() {
        return {
            left: this.x - this.size,
            right: this.x + this.size,
            top: this.y - this.size,
            bottom: this.y + this.size,
        };
    }
}

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.lifetime = 30;
    }

    update() {
        this.lifetime--;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 0, ${this.lifetime / 30})`;
        ctx.fill();
    }

    isExpired() {
        return this.lifetime <= 0;
    }
}

let player;
let enemy;
const shots = [];
const enemyShots = [];
const explosions = [];
const mouse = { x: canvas.width / 2, y: canvas.height - 30 };
let gameOver = false;

function startGame(difficulty) {
    startScreen.classList.add('hidden');
    const instructions = document.getElementById('instructions');
    instructions.classList.remove('hidden');

    setTimeout(() => {
        instructions.classList.add('hidden');
        canvas.classList.remove('hidden');

        switch(difficulty) {
            case 'easy':
                enemySpeed = 2 * SPEED_SCALE;
                enemyShootIntervalBase = 700;
                break;
            case 'medium':
                enemySpeed = 4 * SPEED_SCALE;
                enemyShootIntervalBase = 350;
                break;
            case 'hard':
                enemySpeed = 6 * SPEED_SCALE;
                enemyShootIntervalBase = 100;
                break;
        }

        player = new Player(canvas.width / 2, canvas.height - 30, 'blue');
        enemy = new Enemy();
        gameOver = false;
        shots.length = 0;
        enemyShots.length = 0;
        explosions.length = 0;
        gameLoop();
    }, 5000);
}

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX - canvas.getBoundingClientRect().left;
});

canvas.addEventListener('click', () => {
    const angle = -Math.PI / 2;
    const dx = Math.cos(angle) * SHOT_SPEED;
    const dy = Math.sin(angle) * SHOT_SPEED;
    shots.push(new Shot(player.x, player.y, dx, dy));
});

window.addEventListener('resize', () => {
    CANVAS_WIDTH = window.innerWidth * 0.8;
    CANVAS_HEIGHT = window.innerHeight * 0.8;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    SPEED_SCALE = updateSpeedScale();
    SHOT_SPEED = 10 * SPEED_SCALE;
    adjustPositions();
});

function adjustPositions() {
    if (player) {
        player.y = canvas.height - 30;
        if (player.x < player.size) player.x = player.size;
        if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
    }
    if (enemy) {
        enemy.y = 30;
        if (enemy.x < enemy.size) enemy.x = enemy.size;
        if (enemy.x > canvas.width - enemy.size) enemy.x = canvas.width - enemy.size;
    }
}

function detectCollision(box1, box2) {
    return !(box1.left > box2.right ||
             box1.right < box2.left ||
             box1.top > box2.bottom ||
             box1.bottom < box2.top);
}

function endGame(winner) {
    gameOver = true;
    gameOverMessage.textContent = winner === 'Player' ? 'Winner winner chicken dinner!' : 'You will get him next time!';
    gameOverElement.classList.remove('hidden');
    canvas.classList.add('hidden');
}

function restartGame() {
    gameOverElement.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update(mouse);
    player.draw();

    enemy.update();
    enemy.draw();

    shots.forEach((shot, shotIndex) => {
        shot.update();
        shot.draw();

        if (detectCollision(shot.getBoundingBox(), enemy.getBoundingBox())) {
            enemy.health--;
            shots.splice(shotIndex, 1);
            explosions.push(new Explosion(shot.x, shot.y));
            if (enemy.health <= 0) {
                endGame('Player');
            }
        }

        if (shot.y < 0) {
            shots.splice(shotIndex, 1);
        }
    });

    enemyShots.forEach((shot, shotIndex) => {
        shot.update();
        shot.draw();

        if (detectCollision(shot.getBoundingBox(), player.getBoundingBox())) {
            player.health--;
            enemyShots.splice(shotIndex, 1);
            explosions.push(new Explosion(shot.x, shot.y));
            if (player.health <= 0) {
                endGame('Enemy');
            }
        }

        if (shot.y > canvas.height) {
            enemyShots.splice(shotIndex, 1);
        }
    });

    explosions.forEach((explosion, explosionIndex) => {
        explosion.update();
        explosion.draw();

        if (explosion.isExpired()) {
            explosions.splice(explosionIndex, 1);
        }
    });

    requestAnimationFrame(gameLoop);
}

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

gameLoop();
