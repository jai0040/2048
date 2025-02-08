const gridSize = 4;
const gameContainer = document.getElementById('game-container');
const gameOverPopup = document.getElementById('game-over-popup');
const restartButton = document.getElementById('restart-button');
const currentScoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');
const settingsButton = document.getElementById('settings-button');
const settingsMenu = document.getElementById('settings-menu');
const musicButton = document.getElementById('music-button');
const vibrateButton = document.getElementById('vibrate-button');

let grid = [];
let currentScore = 0;
let isMusicOn = false;
let isVibrateOn = false;

// Initialize High Score from localStorage
let highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.textContent = highScore;

function createGrid() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    currentScore = 0;
    updateScores();
    renderGrid();
    addRandomTile();
    addRandomTile();
    gameOverPopup.style.display = 'none'; // Hide popup on restart
}

function renderGrid() {
    gameContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(cell => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (cell !== 0) {
                tile.textContent = cell;
                tile.dataset.value = cell;
            }
            gameContainer.appendChild(tile);
        });
    });
}

function addRandomTile() {
    const emptyCells = [];
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 0) emptyCells.push({ row: rowIndex, col: colIndex });
        });
    });

    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
        renderGrid();
    } else if (isGameOver()) {
        gameOverPopup.style.display = 'flex'; // Show popup when game is over
        updateHighScore();
    }
}

function isGameOver() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === 0) return false;
            if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) return false;
            if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) return false;
        }
    }
    return true;
}

function updateScores() {
    currentScoreDisplay.textContent = currentScore;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }
}

function updateHighScore() {
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = highScore;
    }
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
    }
});

restartButton.addEventListener('click', createGrid);

settingsButton.addEventListener('click', () => {
    settingsMenu.style.display = settingsMenu.style.display === 'flex' ? 'none' : 'flex';
});

musicButton.addEventListener('click', () => {
    isMusicOn = !isMusicOn;
    musicButton.textContent = `Music: ${isMusicOn ? 'On' : 'Off'}`;
    console.log(`Music is now ${isMusicOn ? 'On' : 'Off'}`);
});

vibrateButton.addEventListener('click', () => {
    isVibrateOn = !isVibrateOn;
    vibrateButton.textContent = `Vibrate: ${isVibrateOn ? 'On' : 'Off'}`;
    console.log(`Vibrate is now ${isVibrateOn ? 'On' : 'Off'}`);
});

createGrid();
