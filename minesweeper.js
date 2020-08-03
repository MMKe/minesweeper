const widths = [0, 9, 16, 30]; // first data is dummy
const heights = [0, 9, 16, 16]; // first data is dummy
const mineCnts = [0, 10, 40, 99]; // first data is dummy

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
    // 1. set variables of board's size and count of mine
    const width = widths[difficulty];
    const height = heights[difficulty];
    const mineCnt = mineCnts[difficulty];

    // 2. create game board
    const gameBoardTable = document.createElement('table');
    gameBoardTable.setAttribute('id', 'gameBoardTable');

    // 2-1. create table header
    const gameBoardTableHeader = document.createElement('thead');
    gameBoardTableHeader.setAttribute('id', 'gameBoardTableHeader');
    gameBoardTable.appendChild(gameBoardTableHeader);

    // 2-2. create table body
    const gameBoardTableBody = document.createElement('tbody');
    gameBoardTableBody.setAttribute('id', 'gameBoardTableBody');
    gameBoardTable.appendChild(gameBoardTableBody);

    // 2-3. fill table body with cell
    for(let h = 0; h < height; h++){
        let gameBoardTableRow = document.createElement('tr');
        gameBoardTableRow.setAttribute('id', `gameBoardTableRow${h}`);

        for(let w = 0; w < width; w++){
            let cell = document.createElement('td');
            cell.setAttribute('id', `w${w}h${h}`);
            cell.setAttribute('height', h);
            cell.setAttribute('width', w);
            
            // add class - cell with classList
            // cell.setAttribute('class', 'cell');
            cell.classList.add('cell');

            // fill with dummy data 
            cell.innerHTML = `ㅁ`;

            // add event listener
            cell.addEventListener('click', cellClickEventListener);

            // add to row
            gameBoardTableRow.appendChild(cell);
        }

        gameBoardTableBody.appendChild(gameBoardTableRow);
    }
    
    // 3. Decide mine cell
    for(let i = 0; i < mineCnt; i++){
        let w, h, mineCell;

        do {
            w = Math.floor(Math.random() * width);
            h = Math.floor(Math.random() * height);

            mineCell = gameBoardTableBody.rows[h].cells[w];
        } while(mineCell.classList.contains('mine'));

        mineCell.classList.add('mine');
    }

    return gameBoardTable;
}

/**
 * cell's click event listener
 * 
 * 1. check this cell is mine.
 *    If this cell is mine, game over
 * 2. Count mine(n) that are around this cell
 * 3. Add clikced_n class to this cell's classList
 * 4-1. If n is larger than 0, changed this innerHTML
 * 4-2. If n is 0, loop around this cell and if that cell have not click_0, click them.
 */
const cellClickEventListener = event => {
    const cell = event.srcElement;
    const isMine = cell.classList.contains('mine');

    // 1. check this cell is mine
    if(isMine) {
        // game end
        console.log('You lose');

        return;
    }

    // 2. Count mine that are around this cell
    const width = widths[difficulty.value];
    const height = heights[difficulty.value];
    
    const cellX = Number(cell.width);
    const cellY = Number(cell.height);

    let aroundMineCnt = 0;

    for(let h = cellY - 1; h <= (cellY + 1); h++){
        // check is valid heigth
        if(h < 0 || h > height - 1) 
            continue;

        for(let w = cellX - 1; w <= (cellX + 1); w++){
            // check is valid width
            if(w < 0 || w > width - 1)
                continue;
            let aroundCell = document.getElementById(`w${w}h${h}`);
            if(aroundCell.classList.contains('mine'))
                aroundMineCnt++;
        } // end w-for

    } // end h-for
    

    // 3. Add clikced_n class to this cell's classList
    cell.classList.add(`clicked_${aroundMineCnt}`);

    if(aroundMineCnt != 0) {
        // 4-1. If n is larger than 0, changed this innerHTML
        cell.innerHTML = aroundMineCnt;
        return;
    } else {
        //  4-2. If n is 0, loop around this cell and if that cell have not click_0, click them.
        cell.innerHTML = '';
        
        for(let h = cellY - 1; h <= (cellY + 1); h++){
            // check is valid heigth
            if(h < 0 || h > height - 1) 
                continue;
    
            for(let w = cellX - 1; w <= (cellX + 1); w++){
                // check is valid width
                if(w < 0 || w > width - 1)
                    continue;

                let aroundCell = document.getElementById(`w${w}h${h}`);

                if(aroundCell.classList.contains(`clicked_0`))  
                    continue;
                
                aroundCell.click();
            } // end w-for
        } // end h-for
    }
    

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
