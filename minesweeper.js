'use strict'

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
            cell.innerHTML = `  `;

            // add event listener
            cell.addEventListener('click', cellClickEventListener);
            cell.addEventListener('contextmenu', cellContextMenuEventListener);

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

    // 0. If left and right button are clicked, call cellAllClickEventListerner
    if(event.buttons === 2){
        cellAllClickEventListener(event);
        return;
    }

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

    loopAroundCell(cell, aroundCell => {
        if(aroundCell.classList.contains('mine'))
            aroundMineCnt++;
    });

    // 3. Add clikced_n class to this cell's classList
    cell.classList.add(`clicked_${aroundMineCnt}`);

    if(aroundMineCnt != 0) {
        // 4-1. If n is larger than 0, changed this innerHTML
        cell.innerHTML = aroundMineCnt;
        return;
    } else {
        //  4-2. If n is 0, loop around this cell and if that cell have not click_0, click them.
        cell.innerHTML = '';
        
        loopAroundCell(cell, aroundCell => {
            if(aroundCell.classList.contains(`clicked_0`))  
                return;
                
            aroundCell.click();
        });
    }
}

/**
 * cell's right click event listener 
 * 
 * 1. check this cell is clicked. If this cell is already clicked, return
 * 2. check this cell's states(cell, flag, question)
 */
const cellContextMenuEventListener = event => {
    // remove original event listener
    event.preventDefault();

    let cell = event.srcElement;

    // 1. check this cell is clicked. If this cell is already clicked, return
    let isClicked = false;

    for(let clazz of cell.classList){
        if(clazz.startsWith('clicked')){
            isClicked = true;
        }
    }

    if(isClicked) return;

    // 2. check this cell's states(cell, flag, question)
    if(cell.classList.contains('flag')) {
        // flag -> question
        cell.innerHTML = '?';
        cell.classList.add('question');
        cell.classList.remove('flag');
    } else if(cell.classList.contains('question')) {
        // question -> cell
        cell.classList.remove('question');
        cell.innerHTML ='  ';
    } else {
        // cell -> flag 
        cell.innerHTML = 'F';
        cell.classList.add('flag');
    }

}

/**
 * cell's left & right click evnet listener
 * 
 * 1. check around cell and count mine and flag
 * 2. If mine's count is not same flag's count (aroundMineCnt !== aroundFlagCnt), return
 * 3. check flag is above mine or return
 * 4. If all flag is correct position, click around not flag cell
 */
const cellAllClickEventListener = event => {
    // 1. check around cell. 
    // 주변 셀들의 깃발을 센다. 
    // 깃발의 수 === 자신 주변의 마인 수일때 로직 진행

    const cell = event.srcElement;
    let isClicked = false;

    let aroundMineCnt;
    let aroundFlagCnt;

    let isCorrect; 

    for(let clazz of cell.classList){
        if(clazz.startsWith('clicked')){
            isClicked = true;
        }
    }

    // 이미 클릭되어 밝혀진 셀에서만 로직을 진행한다. 
    if(!isClicked)
        return;

    // 주변의 지뢰와 깃발의 개수를 센다. 
    // 지뢰와 깃발의 개수가 같을 때만 로직을 진행한다. 
    aroundMineCnt = 0;
    aroundFlagCnt = 0;
    
    loopAroundCell(cell, aroundCell => {
        for(let clazz of aroundCell.classList) {
            if(clazz.startsWith('clicked')) 
                return;
        }
        if(aroundCell.classList.contains('mine')) 
            aroundMineCnt++;
    
        if(aroundCell.classList.contains('flag'))
            aroundFlagCnt++;
    });

    // 지뢰와 깃발의 개수가 다르면 종료한다. 
    if(aroundMineCnt !== aroundFlagCnt)
        return;
    

    // 모든 깃발이 지뢰 위에 있는지 체크한다. 
    // 지뢰 개수 === 깃발 개수이므로, 깃발은 반드시 지뢰 위에만 있어야 한다. 
    // 즉, 지뢰인 곳에 깃발이 없으면 틀린 것이며, 
    //     지뢰가 아닌 곳에 깃발이 있어도 틀린 것이다. 
    isCorrect = true; 
    
    loopAroundCell(cell, aroundCell => {
        for(let clazz of aroundCell.classList) {
            if(clazz.startsWith('clicked')) 
                // if this cell(around cell) is already clicked, continue w_loop
                return;  
        }

        if(aroundCell.classList.contains('mine') && !aroundCell.classList.contains('flag')){
            isCorrect = false;
        } else if(!aroundCell.classList.contains('mine') && aroundCell.classList.contains('flag')){
            isCorrect = false;
        }
    });


    if(!isCorrect){
        // 틀렸다면 게임을 종료시킨다. 
        console.log('game over');
        return;
    } else {
        // 정답인 경우 flag가 아닌 주변 셀을 클릭한다. 
        loopAroundCell(cell, aroundCell => {
            for(let clazz of aroundCell.classList) {
                if(clazz.startsWith('clicked')) 
                    return;   
            }
            
            if(!aroundCell.classList.contains('flag'))
                aroundCell.click();
        })
    }

}

/**
 * loop around targetCell and call callback func
 * 
 * @param {*} targetCell center cell
 * @param {*} callback callback
 */
const loopAroundCell = (targetCell, callback) => {
    const width = widths[difficulty.value];
    const height = heights[difficulty.value];
    
    const cellX = Number(targetCell.width);
    const cellY = Number(targetCell.height);
    
    for(let h = cellY - 1; h <= (cellY + 1); h++){
        // check is valid heigth
        if(h < 0 || h > height - 1) 
            continue;

        for(let w = cellX - 1; w <= (cellX + 1); w++){
            // check is valid width
            if(w < 0 || w > width - 1)
                continue;

            let aroundCell = document.getElementById(`w${w}h${h}`);

            callback(aroundCell);
        } // end w_loop
    } // end h_loop
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
