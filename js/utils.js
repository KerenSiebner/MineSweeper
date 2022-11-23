'use strict'



// Builds the board Set mines at random locations Call setMinesNegsCount() Return the created board
function buildBoard(size, minesCount) {
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    // board[0][1].isMine = true
    // board[2][3].isMine = true
    return board
}

// Render the board as a <table> to the page

function renderBoard(board, selector) {
    
    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {
        
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            var className = `cell cell-${i}-${j}`
            
            if (cell.isMine && cell.isShown) className += ' mine'
            strHTML += `<td class="${className}" onclick ="cellClicked(this, ${i},${j})">`
            
            if (!cell.isMine && cell.isShown) strHTML += `${cell.minesAroundCount}`
        }
        strHTML += '</td></tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
    
}


function countMineNeighbors(cellI, cellJ, board) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            if (board[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

function revealNeighbors(cellI, cellJ, board){
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            if (board[i][j].isMine || board[i][j].isMarked || board[i][j].isShown) continue
            else board[i][j].isShown = true
        }
    }
}


function setMineOnBoard() {
    const mineCount = gLevel.MINE
    console.log('gBoard', gBoard)
    for (var i = 0; i < mineCount; i++) {
        var mineIdx = randonMineIdx()
        console.log('mineIdx', mineIdx)
        while(gBoard[mineIdx.i][mineIdx.j].isMine){
            mineIdx = randonMineIdx()
            console.log('mineIdx', mineIdx)
        }
        gBoard[mineIdx.i][mineIdx.j].isMine=true
    }
}

function randonMineIdx() {
    var randIdx = {}
    var row = getRandomIntInclusive(0, gLevel.SIZE-1)
    var column = getRandomIntInclusive(0, gLevel.SIZE-1)
    randIdx = { i: row, j: column }
    return randIdx
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function onMouseButton(event) {
    console.log('MouseEvent.button', MouseEvent.button)

    switch (MouseEvent.button) {
        case 0:
            cellClicked(elCell, i, j)
            break
        case 2:
            cellMarked(elCell)
            break
    }
}


function startTimer() {
    gStartTime = Date.now() 
    gInterval = setInterval(() => {
        const seconds = (Date.now() - gStartTime) / 1000
        var elH2 = document.querySelector('.time')
        elH2.innerText = seconds.toFixed(3)
    }, 1);
}

function resetTime() {
    var elH2 = document.querySelector('.time')
    elH2.innerText = '0.000'
}