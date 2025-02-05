const gridSize = 4;
const gameContainer = document.getElementById('game-container');
const gameOverPopup = document.getElementById('game-over-popup');
const restartButton = document.getElementById('restart-button');
let grid = [];

function createGrid() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
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
    }
}

function move(direction) {
    let moved = false;
    for (let i = 0; i < gridSize; i++) {
        let line = direction === 'left' || direction === 'right' ? grid[i] : grid.map(row => row[i]);
        if (direction === 'right' || direction === 'down') line.reverse();

        let newLine = line.filter(val => val !== 0);
        for (let j = 0; j < newLine.length - 1; j++) {
            if (newLine[j] === newLine[j + 1]) {
                newLine[j] *= 2;
                newLine[j + 1] = 0;
                moved = true;
            }
        }

        newLine = newLine.filter(val => val !== 0);
        while (newLine.length < gridSize) newLine.push(0);
        if (direction === 'right' || direction === 'down') newLine.reverse();

        if (direction === 'left' || direction === 'right') {
            grid[i] = newLine;
        } else {
            newLine.forEach((val, idx) => grid[idx][i] = val);
        }

        moved = moved || JSON.stringify(line) !== JSON.stringify(newLine);
    }

    if (moved) addRandomTile();
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

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
    }
});

restartButton.addEventListener('click', createGrid);

createGrid();
