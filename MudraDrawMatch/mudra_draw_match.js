document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGameButton');
    const restartGameButton = document.getElementById('restartGameButton');
    const submitDrawingBtn = document.createElement('button');
    submitDrawingBtn.className = 'menuButton hidden';
    submitDrawingBtn.textContent = 'Submit Drawing';

    const gameContainer = document.getElementById('gameContainer');
    const predefinedCanvas = document.getElementById('predefinedCanvas');
    const drawingCanvas = document.getElementById('drawingCanvas');
    const predefinedCtx = predefinedCanvas.getContext('2d');
    const drawingCtx = drawingCanvas.getContext('2d');
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOver');
    const finalScoreDisplay = document.getElementById('finalScore');

    predefinedCanvas.width = drawingCanvas.width = 400;
    predefinedCanvas.height = drawingCanvas.height = 300;

    let drawing = false;
    const brushSize = 5;
    const brushColor = '#000000';

    const shapes = ['circle', 'square', 'triangle'];
    let currentShape = shapes[Math.floor(Math.random() * shapes.length)];

    function drawShape(ctx, shape) {
        ctx.clearRect(0, 0, predefinedCanvas.width, predefinedCanvas.height);
        ctx.beginPath();
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;

        if (shape === 'circle') {
            ctx.arc(predefinedCanvas.width / 2, predefinedCanvas.height / 2, 50, 0, Math.PI * 2);
        } else if (shape === 'square') {
            ctx.rect(predefinedCanvas.width / 2 - 50, predefinedCanvas.height / 2 - 50, 100, 100);
        } else if (shape === 'triangle') {
            ctx.moveTo(predefinedCanvas.width / 2, predefinedCanvas.height / 2 - 50);
            ctx.lineTo(predefinedCanvas.width / 2 - 50, predefinedCanvas.height / 2 + 50);
            ctx.lineTo(predefinedCanvas.width / 2 + 50, predefinedCanvas.height / 2 + 50);
            ctx.closePath();
        }
        ctx.stroke();
    }

    function startGame() {
        resetScore();
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        predefinedCanvas.classList.remove('hidden');
        drawingCanvas.classList.remove('hidden');
        submitDrawingBtn.classList.remove('hidden');
        document.body.appendChild(submitDrawingBtn);
        resetGame();
    }

    function submitDrawing() {
        const score = calculateScore(predefinedCtx, drawingCtx);
        finalScoreDisplay.textContent = `${score.toFixed(2)}%`;
        gameOverScreen.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        predefinedCanvas.classList.add('hidden');
        drawingCanvas.classList.add('hidden');
        submitDrawingBtn.classList.add('hidden');
    }

    function restartGame() {
        resetScore();
        gameOverScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        submitDrawingBtn.classList.add('hidden');
    }

    function resetGame() {
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        currentShape = shapes[Math.floor(Math.random() * shapes.length)];
        drawShape(predefinedCtx, currentShape);
    }

    function resetScore() {
        finalScoreDisplay.textContent = '0';
    }

    function calculateScore(predefinedCtx, drawingCtx) {
        const predefinedImageData = predefinedCtx.getImageData(0, 0, predefinedCanvas.width, predefinedCanvas.height);
        const drawingImageData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

        let totalPixels = predefinedImageData.data.length / 4;
        let matchingPixels = 0;
        let predefinedPixels = 0;
        let drawingPixels = 0;

        for (let i = 0; i < predefinedImageData.data.length; i += 4) {
            const predefinedPixelAlpha = predefinedImageData.data[i + 3];
            const drawingPixelAlpha = drawingImageData.data[i + 3];

            if (predefinedPixelAlpha > 0) {
                predefinedPixels++;
            }
            if (drawingPixelAlpha > 0) {
                drawingPixels++;
            }
            if (predefinedPixelAlpha > 0 && drawingPixelAlpha > 0) {
                const colorDifference = Math.abs(predefinedImageData.data[i] - drawingImageData.data[i]) +
                    Math.abs(predefinedImageData.data[i + 1] - drawingImageData.data[i + 1]) +
                    Math.abs(predefinedImageData.data[i + 2] - drawingImageData.data[i + 2]);
                if (colorDifference < 300) { // Increase tolerance for color difference
                    matchingPixels++;
                }
            }
        }

        const matchScore = (matchingPixels / predefinedPixels) * 100;
        const coverageScore = (matchingPixels / drawingPixels) * 100;
        const baseScore = 50; // Base score to ensure a decent score

        const finalScore = (matchScore + coverageScore) / 2 + baseScore;

        return Math.min(finalScore, 100); // Ensure score does not exceed 100%
    }

    drawingCanvas.addEventListener('mousedown', () => {
        drawing = true;
        drawingCtx.beginPath();
    });

    drawingCanvas.addEventListener('mouseup', () => {
        drawing = false;
        drawingCtx.closePath();
    });

    drawingCanvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        drawingCtx.lineWidth = brushSize;
        drawingCtx.strokeStyle = brushColor;
        drawingCtx.lineTo(e.clientX - drawingCanvas.offsetLeft, e.clientY - drawingCanvas.offsetTop);
        drawingCtx.stroke();
    });

    startGameButton.addEventListener('click', startGame);
    restartGameButton.addEventListener('click', restartGame);
    submitDrawingBtn.addEventListener('click', submitDrawing);
});
