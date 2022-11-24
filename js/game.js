'use strict'

// surpresses rightclick menu
window.oncontextmenu = (e) => {
    e.preventDefault();
}

const MINE = '\u{1F525}'
const LIVE = '\u{1F499}'
// gBoard – A Matrix containing cell objects: Each cell: 
var gBoard = []
var gInterval
var gStartTime
var gLives = 3
var gBestResult


//This is an object by which the board size is set (in this case: 4x4 board and how many mines to put)
var gLevel = {
    SIZE: 4,
    MINE: 2
}

var gGame = {
    isON: false,
    shownCount: 0,
    secsPassed: 0
}

function initGame() {
    if (gInterval) {
        clearInterval(gInterval)
        gInterval = null
    }
    resetTime()
    gGame.isON = true
    renderGameInfo()
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINE)
    renderBoard(gBoard, '.board-container')
}


function cellClicked(elCell, i, j) {
    var strHTML
    const isMarked = isBoardMarked()
    const cell = gBoard[i][j]

    //in case game is over, or already shown or marked - don't allow more clicking
    if (!gGame.isON || cell.isShown || cell.isMarked) return

    //first click
    if (!gGame.shownCount & !isMarked) {
        cell.isShown = true
        onFirstClick(i, j)
    }

    gGame.shownCount++
    // renderShownCell(i, j)

    //stepped on mine:
    if (cell.isMine) {
        elCell.classList.add('mine')
        cell.isShown = true
        gLives--
        if (!checkGameOver()) livesDecreaseMsg()
        //condition where game is over
        if (!gLives) {
            restartButtonChange(false)
            gameOverMsg(false)
            storeBestTime()
            revealMines()
            clearInterval(gInterval)
            gGame.isON = false
        }
    }
    //stepped on cell without a mine
    else {
        if (cell.minesAroundCount) {
            strHTML += `${cell.minesAroundCount}`
            elCell.innerHTML = strHTML
            cell.isShown = true
        } else {
            cell.isShown = true
            expandShown(gBoard, i, j)
        }
    }

    //check if game over
    if (checkGameOver()) {
        clearInterval(gInterval)
    }

    renderBoard(gBoard, '.board-container')
    renderGameInfo()
}

//Called on right click to mark a cell (suspected to be a mine)
// Search the web (and implement) how to hide the context menu on right click

function cellMarked(elCell, i, j) {
    const cell = gBoard[i][j]

    if (!gGame.isON || cell.isShown) return

    //if this is the first move of the game start timer
    if (!isBoardMarked() && !gGame.shownCount) {
        cell.isMarked = true
        elCell.classList.add('flag')
        onFirstClick(i, j)
    }
    else if (cell.isMarked) {
        cell.isMarked = false
        elCell.classList.remove('flag')
    } else {
        cell.isMarked = true
        elCell.classList.add('flag')
        if (checkGameOver()) {
            clearInterval(gInterval)
            gameOverMsg(true)
        }
    }
    // renderBoard(gBoard, '.board-container')
}

function onFirstClick(row, col) {
    startTimer()
    gGame.isON = true
    setMineOnBoard({ row: row, col: col })
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container')
}

//Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    if (gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINE + (3 - gLives)) {
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                var currCell = gBoard[i][j]
                console.log('currCell', currCell)
                if (currCell.isMine && !currCell.isMarked && !currCell.isShown && gLives) return false
            }
        }
        gameOverMsg(true)
        storeBestTime()
        renderBestTime()
        restartButtonChange(true)
        return true
    }
    else return false
}


function gameOverMsg(isWin) {
    const endGameMsg = document.querySelector('h3')
    if (isWin) endGameMsg.innerText = 'You Won!'
    else endGameMsg.innerText = 'You Lost!'
    endGameMsg.hidden = false
}

function gameOverCloseMsg() {
    const endGameMsg = document.querySelector('h3')
    endGameMsg.hidden = true
}

//When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.

function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            if (board[i][j].isMine || board[i][j].isMarked || board[i][j].isShown) continue
            else {
                board[i][j].isShown = true
                gGame.shownCount++
                // renderShownCell(i, j)
            }
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
    resetSmiley()
    gameOverCloseMsg()
    restartGame()
}

function livesDecreaseMsg() {
    const livesMsg = document.querySelector('.lives-msg')
    var plural = ' lives'
    if (gLives === 1) plural = ' life'
    livesMsg.innerText = `You have ${gLives} ${plural} left! `
    livesMsg.hidden = false
    setTimeout(() => { livesMsg.hidden = true }, 1000)
}

//check if there is a best time in the local storage
function storeBestTime() {
    var prevBest = localStorage.getItem('bestResult');
    const timeToSolve = gGame.secsPassed
    
    if (!prevBest || timeToSolve < prevBest) {
        gBestResult = timeToSolve;
        localStorage.setItem('BestResult', gBestResult);
    }
}
function renderBestTime(){
    const strHTML = `<h2>BEST TIME: ${gBestResult} seconds</h2>`
    var elBestTime = document.getElementsByClassName('.best')
    elBestTime.innerHTML = strHTML
}