document.addEventListener('DOMContentLoaded', () => {
    const startGameBtn = document.getElementById('start-game-btn');
    const submitDrawingBtn = document.getElementById('submit-drawing-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const gameContainer = document.getElementById('game');
    const instructionsContainer = document.getElementById('instructions');
    const scoreContainer = document.getElementById('score');
    const scoreValue = document.getElementById('score-value');
    const predefinedCanvas = document.getElementById('predefined-canvas');
    const drawingCanvas = document.getElementById('drawing-canvas');
    const predefinedCtx = predefinedCanvas.getContext('2d');
    const drawingCtx = drawingCanvas.getContext('2d');
    
    let drawing = false;
    const brushSize = 5;
    const brushColor = '#000000';
    
    const shapes = ['circle', 'square', 'triangle'];
    let currentShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    const drawShape = (ctx, shape) => {
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
    };
    
    drawShape(predefinedCtx, currentShape);
    
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
    
    startGameBtn.addEventListener('click', () => {
        instructionsContainer.style.display = 'none';
        gameContainer.style.display = 'block';
    });
    
    submitDrawingBtn.addEventListener('click', () => {
        const score = calculateScore(predefinedCtx, drawingCtx);
        scoreValue.textContent = `${score.toFixed(2)}%`;
        scoreContainer.style.display = 'block';
        submitDrawingBtn.style.display = 'none';
        restartGameBtn.style.display = 'inline-block';
    });
    
    restartGameBtn.addEventListener('click', () => {
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        scoreContainer.style.display = 'none';
        submitDrawingBtn.style.display = 'inline-block';
        restartGameBtn.style.display = 'none';
        currentShape = shapes[Math.floor(Math.random() * shapes.length)];
        drawShape(predefinedCtx, currentShape);
    });
    
    const calculateScore = (predefinedCtx, drawingCtx) => {
        const predefinedImageData = predefinedCtx.getImageData(0, 0, predefinedCanvas.width, predefinedCanvas.height);
        const drawingImageData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
        
        let totalPixels = predefinedImageData.data.length / 4;
        let matchingPixels = 0;
        let predefinedPixels = 0;
        let drawingPixels = 0;
        
        for (let i = 0; i < predefinedImageData.data.length; i += 4) {
            const predefinedPixel = predefinedImageData.data.slice(i, i + 4);
            const drawingPixel = drawingImageData.data.slice(i, i + 4);
            
            const predefinedIsDrawn = predefinedPixel[3] > 0; // Check alpha channel
            const drawingIsDrawn = drawingPixel[3] > 0; // Check alpha channel
            
            if (predefinedIsDrawn) {
                predefinedPixels++;
            }
            if (drawingIsDrawn) {
                drawingPixels++;
            }
            if (predefinedIsDrawn && drawingIsDrawn) {
                const colorDifference = Math.abs(predefinedPixel[0] - drawingPixel[0]) +
                                       Math.abs(predefinedPixel[1] - drawingPixel[1]) +
                                       Math.abs(predefinedPixel[2] - drawingPixel[2]);
                if (colorDifference < 150) { // Further increase tolerance for color difference
                    matchingPixels++;
                }
            }
        }
        
        const matchScore = (matchingPixels / predefinedPixels) * 100;
        const coverageScore = (drawingPixels / predefinedPixels) * 100;
        
        return (matchScore + coverageScore) / 2;
    };
});
