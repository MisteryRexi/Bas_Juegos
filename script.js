const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeBtn = document.querySelector('.close');
const saveSettingsBtn = document.getElementById('saveSettings');
const scoreSpan = document.getElementById('score');
const gameOverModal = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = [];
let score = 0;
let gameInterval;
let gamePaused = false;
let speed = 5;
let snakeColor = '#00FF00';
let targetsCount = 1;

function startGame() {
    resetGame();
    placeFood();
    gameInterval = setInterval(gameLoop, 1000 / speed);
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';

    // Mostrar las flechas de control en dispositivos móviles
    if (window.innerWidth <= 600) {
        document.querySelector('.arrow-controls').style.display = 'block';
    }
}


function pauseGame() {
    gamePaused = true;
    clearInterval(gameInterval);
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'inline-block';
}

function resumeGame() {
    gamePaused = false;
    gameInterval = setInterval(gameLoop, 1000 / speed);
    resumeBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreSpan.textContent = `Puntuación: ${score}`;
}

function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        clearInterval(gameInterval);
        gameOverModal.style.display = 'block';
    } else {
        drawGame();
    }
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    for (let i = 0; i < food.length; i++) {
        if (head.x === food[i].x && head.y === food[i].y) {
            food.splice(i, 1);
            placeFood();
            score += 1;
            scoreSpan.textContent = `Puntuación: ${score}`;
            return;
        }
    }
    snake.pop();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = snakeColor;
    snake.forEach(part => ctx.fillRect(part.x * 10, part.y * 10, 10, 10));
    ctx.fillStyle = '#FF0000';
    food.forEach(f => ctx.fillRect(f.x * 10, f.y * 10, 10, 10));
}

function placeFood() {
    while (food.length < targetsCount) {
        const newFood = {
            x: Math.floor(Math.random() * (canvas.width / 10)),
            y: Math.floor(Math.random() * (canvas.height / 10))
        };
        if (!snake.some(part => part.x === newFood.x && part.y === newFood.y) &&
            !food.some(f => f.x === newFood.x && f.y === newFood.y)) {
            food.push(newFood);
        }
    }
}

function checkCollision() {
    const head = snake[0];
    return snake.slice(1).some(part => part.x === head.x && part.y === head.y) ||
        head.x < 0 || head.x >= canvas.width / 10 ||
        head.y < 0 || head.y >= canvas.height / 10;
}

restartBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    startGame();
});

document.addEventListener('keydown', e => {
    if (!gamePaused) {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
            case 's':
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
            case 'a':
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
            case 'd':
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
        }
    }
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);

settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

saveSettingsBtn.addEventListener('click', () => {
    speed = parseInt(document.getElementById('speed').value);
    targetsCount = parseInt(document.getElementById('targets').value);

    const colorSelect = document.getElementById('color').value;
    if (colorSelect === 'green') {
        snakeColor = '#00FF00'; // Verde
    } else if (colorSelect === 'blue') {
        snakeColor = '#0000FF'; // Azul
    } else if (colorSelect === 'gradient') {
        // Aquí puedes implementar la lógica para el degradado personalizado
        snakeColor = '#4B0082'; // Ejemplo de color base (púrpura oscuro)
    }

    settingsModal.style.display = 'none';
});
// Función para manejar clic en botones de flecha
function handleArrowClick(newDirection) {
    if (!gamePaused) {
        switch (newDirection) {
            case 'up':
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case 'down':
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
            case 'left':
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case 'right':
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
        }
    }
}

// Obtener referencias a los botones de flecha
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Agregar event listeners para clic en botones de flecha
upBtn.addEventListener('click', () => handleArrowClick('up'));
downBtn.addEventListener('click', () => handleArrowClick('down'));
leftBtn.addEventListener('click', () => handleArrowClick('left'));
rightBtn.addEventListener('click', () => handleArrowClick('right'));

// Obtener referencia a las flechas de control
const arrowControls = document.querySelector('.arrow-controls');

// Función para mostrar u ocultar las flechas de control según la resolución
function toggleArrowControls() {
    if (window.innerWidth <= 600) {
        arrowControls.style.display = 'block'; // Mostrar en dispositivos móviles
    } else {
        arrowControls.style.display = 'none'; // Ocultar fuera de la responsiva
    }
}
// JavaScript para mostrar el modal y aplicar la animación
settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
    settingsModal.classList.add('show-modal');
});

// JavaScript para cerrar el modal
closeBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    settingsModal.classList.remove('show-modal');
});

// Añadir la clase 'rounded-button' a los botones relevantes
restartBtn.classList.add('rounded-button');
startBtn.classList.add('rounded-button');
pauseBtn.classList.add('rounded-button');
resumeBtn.classList.add('rounded-button');
settingsBtn.classList.add('rounded-button');
saveSettingsBtn.classList.add('rounded-button');
upBtn.classList.add('rounded-button');
downBtn.classList.add('rounded-button');
leftBtn.classList.add('rounded-button');
rightBtn.classList.add('rounded-button');

// Ejecutar la función al cargar la página y al cambiar el tamaño de la ventana
toggleArrowControls(); // Mostrar u ocultar inicialmente según la resolución
window.addEventListener('resize', toggleArrowControls); // Actualizar al cambiar el tamaño de la ventana

window.onclick = function(event) {
    if (event.target == settingsModal) {
        settingsModal.style.display = 'none';
    }
};
document.getElementById('menuButton').addEventListener('click', function() {
    var menuItems = document.getElementById('menuItems');
    if (menuItems.style.display === 'block') {
        menuItems.style.display = 'none';
    } else {
        menuItems.style.display = 'block';
    }
});
