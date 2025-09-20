const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const vsHumanBtn = document.getElementById('vs-human');
const vsAiBtn = document.getElementById('vs-ai');

let currentPlayer = 'X';
let gameActive = false;
let gameMode = null; // 'human' or 'ai'
let boardState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    boardState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('taken');

    checkResult();

    if (gameActive && gameMode === 'ai' && currentPlayer === 'X') {
        currentPlayer = 'O';
        setTimeout(aiMove, 500);
    } else if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkResult() {
    let roundWon = false;
    let winningLine = [];
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningLine = winCondition;
            break;
        }
    }

    if (roundWon) {
        highlightWinningLine(winningLine);
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        setTimeout(resetGame, 2000);
        return;
    }

    let roundDraw = !boardState.includes('');
    if (roundDraw) {
        statusText.textContent = 'Draw!';
        gameActive = false;
        setTimeout(resetGame, 2000);
        return;
    }
}

function highlightWinningLine(line) {
    line.forEach(index => {
        cells[index].style.backgroundColor = '#90ee90'; // light green highlight
    });
}

function aiMove() {
    let availableCells = [];
    boardState.forEach((cell, index) => {
        if (cell === '') {
            availableCells.push(index);
        }
    });

    if (availableCells.length === 0) return;

    // Simple AI: random move
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const aiCellIndex = availableCells[randomIndex];

    boardState[aiCellIndex] = 'O';
    cells[aiCellIndex].textContent = 'O';
    cells[aiCellIndex].classList.add('taken');

    checkResult();

    if (gameActive) {
        currentPlayer = 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function resetGame() {
    currentPlayer = 'X';
    gameActive = false;
    gameMode = null;
    boardState = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = 'Choose a game mode to start!';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
        cell.style.backgroundColor = '#fff'; // reset highlight
    });
}

function startGame(mode) {
    if (gameActive) {
        resetGame();
    }
    gameMode = mode;
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
vsHumanBtn.addEventListener('click', () => startGame('human'));
vsAiBtn.addEventListener('click', () => startGame('ai'));
