'use strict'

// surpresses rightclick menu
window.oncontextmenu = (e) => {
    e.preventDefault();
}

const MINE = '\u{1F525}'
// gBoard – A Matrix containing cell objects: Each cell: 
var gBoard = []
var gInterval
var gTime
var gStartTime
var gClickCount = 0


//This is an object by which the board size is set (in this case: 4x4 board and how many mines to put)
var gLevel = {
    SIZE: 4,
    MINE: 2
}

// This is an object in which you can keep and update the current game state:
// isOn: Boolean, when true we let the user play
// shownCount: How many cells are shown 
// markedCount: How many cells are marked (with a flag)
// secsPassed: How many seconds passed

var gGame = {
    isON: false,
    shownCount: 0,
    secsPassed: 0
}

function initGame() {
    gameOverMsgToggle()
    if (gInterval) clearInterval(gInterval)
    gGame.isON = true
    resetTime()
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINE)
    setMineOnBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container')
    // initRightClick()
}

//send with elCell
// function initRightClick(){
//     const elCell = document.querySelector('.cell cell-0-0')
//     elCell.addEventListener('contextmenu',cellMarked())
// }

//Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    const size = gLevel.SIZE
    var currMineCount = 0
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            currMineCount = countMineNeighbors(i, j, gBoard)
            board[i][j].minesAroundCount = currMineCount
        }
        currMineCount = 0
    }
}

function cellClicked(elCell, i, j) {
    console.log('gGame', gGame)
    if (!gClickCount) {
        startTimer()
        gGame.isON = true
    }
    gClickCount++

    if (!gGame.isON) return

    //condition where game is over

    var strHTML
    const cell = gBoard[i][j]
    if (cell.isMine) {
        elCell.classList.add('mine')
        cell.isShown = true
        gameOverMsgToggle(false)
        clearInterval(gInterval)
        gGame.isON = false
    }
    else {
        if (cell.minesAroundCount) {
            strHTML += `${cell.minesAroundCount}`
            elCell.innerHTML = strHTML
            cell.isShown = true
        } else {
            expandShown(gBoard, i, j)
        }
    }
    if (checkGameOver()) clearInterval(gInterval)
    renderBoard(gBoard, '.board-container')

}


//Called on right click to mark a cell (suspected to be a mine)
// Search the web (and implement) how to hide the context menu on right click
//add par elCell



function cellMarked() {
    console.log('Im marked!')

}

//Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isShown) return false
        }
    }
    gameOverMsgToggle(true)
    return true
}

function gameOverMsgToggle(isWin) {
    const endGameMsg = document.querySelector('h3')
    if (endGameMsg.hidden) {
        if (isWin) endGameMsg.innerText = 'You Won!'
        else endGameMsg.innerText = 'You Lost!'
        endGameMsg.hidden = false
    }
    else endGameMsg.hidden = true
}

//When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
// NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors
// BONUS: if you have the time later, try to work more like the real algorithm (see description
// at the Bonuses section below)

function expandShown(board, cellI, cellJ) {
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

function changeLevel(level) {
    if (level === 'beginner') {
        gLevel.SIZE = 4
        gLevel.MINE = 2
    }
    else if (level === 'medium') {
        gLevel.SIZE = 8
        gLevel.MINE = 14
    }
    else {
        gLevel.SIZE = 12
        gLevel.MINE = 32
    }
    initGame()
}