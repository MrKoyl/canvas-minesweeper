import CONST from '../utils/gameBoardConstants'

export default function Canvas(canvas, clickHandler, rclickHandler, dbclickHandler) {
    const images = {
        mine: new Image(),
        grass: new Image()
    }
    Object.keys(images).forEach(key => {
        images[key].src = `./assets/${CONST.IMAGES[key]}`
        images[key].onload = () => console.log(`${key} loaded`);
    });

    const $ = canvas.getContext('2d');


    const cellSize = 45;
    canvas.onclick = (e) => clickHandler({ x: parseInt(e.offsetX / cellSize), y: parseInt(e.offsetY / cellSize) });
    canvas.oncontextmenu = (e) => rclickHandler({ x: parseInt(e.offsetX / cellSize), y: parseInt(e.offsetY / cellSize) });
    canvas.ondblclick = (e) => dbclickHandler({ x: parseInt(e.offsetX / cellSize), y: parseInt(e.offsetY / cellSize) });

    function drawCell(x, y) {
        $.fillStyle = 'black'
        $.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        // $.fillStyle = 'green';
        // $.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
        $.drawImage(images.grass, x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2)
    }

    function drawAllCells(size) {
        $.drawImage(images.grass, 1, 1, 1000, 1000);
        for (let i = 0; i < size.height; i++) {
            for (let j = 0; j < size.width; j++) {
                drawCell(j, i);
            }
        }
    }

    return {
        initialDraw(size) {
            canvas.width = size.width * cellSize;
            canvas.height = size.height * cellSize;
            drawAllCells(size);
        },

        gameDraw(board) {
            board.map((_, y) => _.map((__, x) => {
                if (__.show) {
                    $.fillStyle = 'white';
                    $.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
                    if (__.number) {
                        $.fillStyle = 'black';
                        $.font = `${cellSize / 2}px serif`;
                        $.fillText(__.number, (x + 0.5) * cellSize + 1, (y + 0.5) * cellSize + 1, cellSize - 2, cellSize - 2);
                    }
                }
                else {
                    if (__.protected) {
                        $.fillStyle = 'yellow';
                        $.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
                    }
                    else {
                        $.drawImage(images.grass, x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2)
                    }
                }
            }))
        },

        showBombs(board) {
            board.map((_, y) => _.map((__, x) => {
                if (__.mine) {
                    $.drawImage(images.mine, x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
                }
            }))
        },

        redrawCell(x, y, cell) {
            if (cell.show) {
                $.fillStyle = 'white';
                $.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
                if (cell.number) {
                    $.fillStyle = 'black';
                    $.font = `${cellSize / 2}px serif`;
                    $.fillText(cell.number, (x + 0.5) * cellSize + 1, (y + 0.5) * cellSize + 1, cellSize - 2, cellSize - 2);
                }
            }
            else {
                if (cell.protected) {
                    $.fillStyle = 'yellow';
                    $.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
                }
                else {
                    $.drawImage(images.grass, x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2)
                }
            }
        }
    }
}