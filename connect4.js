/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7
const HEIGHT = 6

let currPlayer = 1 // active player: 1 or 2
let board = [] // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  // makes 6 rows, each row with 7 undefined elements in it
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: HEIGHT })) // setting a length property on the object will create an array of that length with all elements undefined
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board')
  // TODO: add comment for this code
  const top = document.createElement('tr') // create a tr element called top
  top.setAttribute('id', 'column-top') // give it an id of column-top
  top.addEventListener('click', handleClick) // add an event listener to the top
  // loop 7 times to create 7 cells each with an id that corresponds to its index and append them to the top tr elemement
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td')
    headCell.setAttribute('id', x)
    top.append(headCell)
  }
  htmlBoard.append(top)

  // TODO: add comment for this code
  // create 6 tr rows and 7 td cells within each row
  // for each cell give it an id that corresponds to its y - x position; i.e '0-0' through '5-6'
  // append those cells to each row, and each row to the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr')
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td')
      cell.setAttribute('id', `${y}-${x}`)
      row.append(cell)
    }
    htmlBoard.append(row)
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  // y is initialized as HEIGHT - 1 to start looping at the bottom most row
  for (let y = HEIGHT - 1; y >= 0; y--) {
    //check the coordinates below the x input
    // if its not undefined, that means that a piece has been placed in the spot, so return the y coordinate, which is the topmost empty cell in the x column
    if (!board[y][x]) {
      return y
    }
  }
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement('div')
  piece.classList.add('piece')
  piece.classList.add(`p${currPlayer}`)
  //piece.style.top = -50 * (y + 2)

  const spot = document.getElementById(`${y}-${x}`)
  spot.append(piece)
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id // + sign converts it to number

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x)
  if (y === null) {
    return
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer
  placeInTable(y, x)

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`)
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // if every cell in every row has a piece placed and no player has won
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame('Tie Game')
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    )
  }

  // TODO: read and understand this code. Add comments to help you.
  // loop through the rows
  for (let y = 0; y < HEIGHT; y++) {
    // loop through each cell in the row
    for (let x = 0; x < WIDTH; x++) {
      // look at 4 consecutive cells horizontally
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ]
      // an array to look at 4 consecutive cells vertically
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ]
      // an array to look at 4 consecutive cells to the right diagonally
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ]
      // an array to look at 4 consecutive cells diagonally to the left
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ]
      // if calling _win with any of the arrays passed in returns true...
      // !!! THERE IS A WINNER !!!
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true
      }
    }
  }
}

makeBoard()
makeHtmlBoard()
