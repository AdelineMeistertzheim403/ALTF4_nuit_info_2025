


const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


// Initialisation du snake
function initSnake() {
    snake = [];
    const startX = canvas.width / 2;
    const startY = canvas.height / 2;

    for (let i = 0; i < INITIAL_LENGTH; i++) {
        snake.push({
            x: startX - i * SEGMENT_SPACING,
            y: startY
        });
    }
}

<canvas id="game" width="500" height="500"></canvas>