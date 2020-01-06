import Minesweeper from './classes/gameBoard'
import CONST from './utils/gameBoardConstants'

const MS = new Minesweeper(document.getElementById('gameCanvas'));

document.oncontextmenu = (e) => e.preventDefault();
document.ondblclick = (e) => e.preventDefault();

document.getElementById('newGame').onclick = () => MS.newGame(+document.getElementById('diff').innerText, +document.getElementById('size').innerText / 10);

document.getElementById('size-').onclick = () => {
    document.getElementById('size').innerText = +document.getElementById('size').innerText > CONST.VALIDATES.size.min + 10
        ? +document.getElementById('size').innerText - 10
        : CONST.VALIDATES.size.min;
}

document.getElementById('size+').onclick = () => {
    document.getElementById('size').innerText = +document.getElementById('size').innerText < CONST.VALIDATES.size.max
        ? +document.getElementById('size').innerText + 10
        : CONST.VALIDATES.size.max;
}

document.getElementById('diff-').onclick = () => {
    document.getElementById('diff').innerText = +document.getElementById('diff').innerText > CONST.VALIDATES.difficulty.min + 1
        ? +document.getElementById('diff').innerText - 1
        : CONST.VALIDATES.difficulty.min;
}

document.getElementById('diff+').onclick = () => {
    document.getElementById('diff').innerText = +document.getElementById('diff').innerText < CONST.VALIDATES.difficulty.max
        ? +document.getElementById('diff').innerText + 1
        : CONST.VALIDATES.difficulty.max;
}