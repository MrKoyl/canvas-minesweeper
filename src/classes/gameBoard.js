import CONST from '../utils/gameBoardConstants'
import Canvas from './canvas'

const sizeMultyplier = 10;

const checkSizeProperty = (property) =>
    property <= CONST.VALIDATES.size.max &&
    property >= CONST.VALIDATES.size.min;

function getSizeValue(size) {
    const calculatedSize = size * sizeMultyplier;
    return checkSizeProperty(calculatedSize)
        ? { width: calculatedSize, height: calculatedSize }
        : { width: CONST.VALIDATES.size.min, height: CONST.VALIDATES.size.min };
}

function getCustomSizeValue(props) {
    return checkSizeProperty(props.width) && checkSizeProperty(props.height)
        ? props
        : getSizeValue(0);
}

function getDifficultyValue(difficulty) {
    return difficulty >= CONST.VALIDATES.difficulty.min &&
        difficulty <= CONST.VALIDATES.difficulty.max
        ? difficulty
        : CONST.VALIDATES.difficulty.min
}

function checkForWin(board) {
    return board.every(row =>
        row.every(cell =>
            cell.show || cell.mine));
}

function generateBoard(size, difficulty, start) {
    let mines = parseInt(size.width * size.height * (difficulty / 10));
    const board = [...Array(size.height)].map(() => [...Array(size.width)].map(() => ({
        number: 0,
        mine: false,
        show: false,
        protected: false
    })));
    const isCellValidForMineFenerate = (x, y, start) => (
        board[y][x].mine === false &&
        (x > start.x + 1 || x < start.x - 1 || y > start.y + 1 || y < start.y - 1)
    )
    for (let i = 0; i < 10000 && mines; i++) {
        let newMineX = parseInt(Math.random() * size.width), newMineY = parseInt(Math.random() * size.height);
        if (isCellValidForMineFenerate(newMineX, newMineY, start)) {
            board[newMineY][newMineX].mine = true;
            mines--;
        };
    }
    return board;
}

function loadNumbers(board) {
    const calculate = (board, x, y) => {
        let sum = 0;
        for (let i = y - 1; i <= y + 1; i++) {
            for (let j = x - 1; j <= x + 1; j++) {
                if (board[i] && board[i][j] && !(i === y && j === x)) sum += +board[i][j].mine;
            }
        }
        return sum;
    }
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            board[y][x].number = calculate(board, x, y);
        }
    }
}

export default function Minesweeper(canvas) {
    const drawer = new Canvas(canvas, clickHandler, rclickHandler, dbclickHandler);
    let size, difficulty, board, initialClick = false, gameIsOn = false, bombs;

    function openCell(x, y) {
        if (gameIsOn) {
            if (board[y][x].show === false && board[y][x].protected !== true) {
                if (board[y][x].mine) {
                    gameIsOn = false;
                }
                else {
                    board[y][x].show = true;
                    if (board[y][x].number === undefined || board[y][x].number === 0) {
                        for (let i = y - 1; i <= y + 1; i++) {
                            for (let j = x - 1; j <= x + 1; j++) {
                                if (board[i] && board[i][j] && !(i === y && j === x)) openCell(j, i);
                            }
                        }
                    }
                }
            }
            drawer.redrawCell(x, y, board[y][x]);
            if (!gameIsOn) drawer.showBombs(board);
        }
    }

    function clickHandler(cellCoords) {
        if (gameIsOn) {
            if (initialClick) {
                drawer.initialDraw(size);
                board = generateBoard(size, difficulty, cellCoords);
                loadNumbers(board);
                initialClick = false;
                bombs = parseInt(size.width * size.height * (difficulty / 10));
                document.getElementById('bombs').innerText = bombs;
            }
            openCell(cellCoords.x, cellCoords.y);
            if (checkForWin(board)) {
                gameIsOn = false;
                alert('VICTORY!!!');
            }
        }
    }

    function rclickHandler(cellCoords) {
        if (board && board[cellCoords.y][cellCoords.x].show === false && gameIsOn) {
            if (board[cellCoords.y][cellCoords.x].protected) {
                board[cellCoords.y][cellCoords.x].protected = false;
                bombs++;
            }
            else if (bombs > 0) {
                board[cellCoords.y][cellCoords.x].protected = true;
                bombs--;
            }
            drawer.gameDraw(board);
            document.getElementById('bombs').innerText = bombs;
        }
    }

    function dbclickHandler(cellCoords) {
        if (board[cellCoords.y][cellCoords.x].number && gameIsOn) {
            let counter = 0;
            for (let i = cellCoords.y - 1; i <= cellCoords.y + 1; i++) {
                for (let j = cellCoords.x - 1; j <= cellCoords.x + 1; j++) {
                    if (board[i] && board[i][j] && !(i === cellCoords.y && j === cellCoords.x) &&
                        board[i][j].protected) counter++;
                }
            }
            if (counter === board[cellCoords.y][cellCoords.x].number) {
                for (let i = cellCoords.y - 1; i <= cellCoords.y + 1; i++) {
                    for (let j = cellCoords.x - 1; j <= cellCoords.x + 1; j++) {
                        if (board[i] && board[i][j] && !(i === cellCoords.y && j === cellCoords.x) &&
                            board[i][j].protected === false) openCell(j, i);
                    }
                }
            }
            if (checkForWin(board)) {
                gameIsOn = false;
                alert('VICTORY!!!');
            }
        }
    }

    return {
        newGame: (gameDifficulty = 2, BoardSize = 1, sizeProperties) => {
            size = BoardSize === 0 ? getCustomSizeValue(sizeProperties) : getSizeValue(BoardSize);
            difficulty = getDifficultyValue(gameDifficulty);
            drawer.initialDraw(size);
            initialClick = true;
            gameIsOn = true;
        }
    }
}