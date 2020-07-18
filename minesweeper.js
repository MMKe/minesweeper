/**
*
*/
const createNewGame = difficulty => {
    // 1. create main window
    const mainWindow = document.createElement('div');
    mainWindow.setAttribute('id', 'mainWindow');

    // 2. create header and append to main window
    const boardHeader = document.createElement('div');
    boardHeader.setAttribute('id', 'boardHeader');
    mainWindow.appendChild(boardHeader);

    // 3. create header's children and append them
    // 3-1. create board to show amount of mine, and append to header
    const amountMineShow = document.createElement('div');
    amountMineShow.setAttribute('id', 'amountMineShow');
    boardHeader.appendChild(amountMineShow);

    // 3-2. create board to show count of user find mine, and append to header
    const foundMineShow = document.createElement('div');
    foundMineShow.setAttribute('id', 'foundMineShow');
    boardHeader.appendChild(foundMineShow);

    // 3-3. create refresh button, and append to header
    const refreshBtn = document.createElement('button');
    refreshBtn.setAttribute('id', 'refreshBtn');
    boardHeader.appendChild(refreshBtn);

    // append dummy text node to test
    //amountMineShow.innerHTML = difficulty;
    //foundMineShow.innerHTML = '00';

    // 4. create game board and append to main window
    const gameBoard = createNewGameBoard(difficulty);
    mainWindow.appendChild(gameBoard);

    return mainWindow;
}

const createNewGameBoard = difficulty => {
    const widths = [0, 9, 16, 30]; // first data is dummy
    const heights = [0, 9, 16, 16]; // first data is dummy
    const mineCnts = [0, 10, 40, 99]; // first data is dummy

    // 1. set variables of board's size and count of mine
    const width = widths[difficulty];
    const height = heights[difficulty];
    const mineCnt = mineCnts[difficulty];

    // 2. create game board
    const gameBoardTable = document.createElement('table');
    gameBoardTable.setAttribute('id', 'gameBoardTable');

}

window.onload = () => {
    /* initialize start*/
    let newGame = createNewGame(difficulty.value);
    board.appendChild(newGame);
    /* initialize end*/

    /* Add event listener start */
    difficulty.addEventListener('change', () => {
        while(board.firstChild) {
            board.firstChild.remove();
        }
        board.appendChild(createNewGame(difficulty.value));
    })

    /* Add event listener end */

}
