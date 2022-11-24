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
            if (cell.isShown) className += ' shown'
            if (cell.isMarked) className += ' flag'

            strHTML += `<td class="${className}" onclick ="cellClicked(this, ${i},${j})" oncontextmenu ="cellMarked(this, ${i},${j})">`
            
            if (!cell.isMine && cell.isShown && (cell.minesAroundCount!==0)) strHTML += `${cell.minesAroundCount}`
        }
        strHTML += '</td></tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
    
}

function renderShownCell(row, column) {
    const elCell = document.querySelector(`.cell-${row}-${column}`)
    elCell.style.backgroundColor = 'blue'
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

function revealNeighbors(cellI, cellJ, board){
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            const currCell = board[i][j]
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            if (currCell.isMine || currCell.isMarked || currCell.isShown) continue
            else currCell.isShown = true
        }
    }
}

function setMineOnBoard() {
    const mineCount = gLevel.MINE
    for (var i = 0; i < mineCount; i++) {
        var mineIdx = randonMineIdx()
        var currCell = gBoard[mineIdx.i][mineIdx.j]
        console.log('gBoard', gBoard)
        while(currCell.isMine || currCell.isShown){
            mineIdx = randonMineIdx()
            currCell = gBoard[mineIdx.i][mineIdx.j]
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
        elH2.innerText = seconds.toFixed(0)
        gGame.secsPassed=seconds.toFixed(0)
    }, 1);
}

function resetTime() {
    var elH2 = document.querySelector('.time')
    elH2.innerText = '0'
}

function restartGame() {
    gBoard = []
    gStartTime = null
    gGame.shownCount = 0
    gLives = 3
    gGame.secsPassed=0
    gameOverCloseMsg()
    clearInterval(gInterval)
    resetTime()
    resetSmiley()
    initGame()
}

function restartButtonChange(isWin) {
    const elRestartButton = document.querySelector('.re-start')
    if (isWin) elRestartButton.style.backgroundImage = 'url(img/king.png)'
    else elRestartButton.style.backgroundImage = 'url(img/dead.png)'
}

function resetSmiley() {
    const elRestartButton = document.querySelector('.re-start')
    elRestartButton.style.backgroundImage = 'url(img/smiley.png)'
}

function renderGameInfo() {
    var level = ''
    switch (gLevel.SIZE) {
        case 4: level = 'BEGINNER'
            break
        case 8: level = 'MEDIUM'
            break
        case 12: level = 'EXPERT'
            break
    }
    var hearts = ''
    switch (gLives) {
        case 3: hearts = LIVE + LIVE + LIVE
            break
        case 2: hearts = LIVE + LIVE
            break
        case 1: hearts = LIVE
            break
    }

    var strHTML = '<table class=".data" border="1"><tbody>'
    strHTML += `<tr><th>SECONDS PASSED</th><th>SHOWN COUNT</th> <th>LEVEL</th><th>LIVES</th></tr>`
    strHTML += `<tr><td>${gGame.secsPassed}</td><td>${gGame.shownCount}</td><td>${level}</td><td>${hearts}</td></tr>`
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(".table-data")
    elContainer.innerHTML = strHTML
}

function isBoardMarked() {
    const size = gBoard.length
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (gBoard[i][j].isMarked) return true
        }
    }
    return false
}

function revealMines(){
    const size = gBoard.length
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            const currCell =gBoard[i][j]
            if (currCell.isMine) currCell.isShown = true
        }
    }
    return false
}

