var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

let score = 0;
var gBoard;
var gGamerPos;
let interval;
let isGameRunning = true; 
let ballsCount=0;

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	ballsCount = 2;
	
	// Start adding balls every 2 seconds
    interval = setInterval(addBall, 2000);
}

// Function to place a ball at a random empty cell
function addBall() {
    if (!isGameRunning) return;

    // Get all empty cells
    const emptyCells = [];
    for (var i = 1; i < gBoard.length - 1; i++) {
        for (var j = 1; j < gBoard[0].length - 1; j++) {
            if (!gBoard[i][j].gameElement) {
                emptyCells.push({ i, j });
            }
        }
    }

    // If no empty cell is found, do nothing
    if (emptyCells.length === 0) return;
	ballsCount++;
    // Choose a random empty cell
    const randIdx = Math.floor(Math.random() * emptyCells.length);
    const randCell = emptyCells[randIdx];

    // Place the ball in the selected empty cell
    gBoard[randCell.i][randCell.j].gameElement = BALL;
	
    // Render the cell with the new ball
    renderCell(randCell, BALL_IMG);
}

function buildBoard() {
	// Create the Matrix
	// var board = createMat(10, 12)
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
				if (i===0&&j===5 || i===9&&j===5 || j===0&&i===5 || j===11&&i===5) {
					cell.type = FLOOR;
                }
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To ES6 template string
			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	console.log('strHTML is:');
	console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

function moveOnEdges(i,j) { 
	if (i===-1&&j===5){
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		gGamerPos.i = 9;
		gGamerPos.j = 5;
		// MOVING from current position
		
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
		return true;
	}
	else if (i===10&&j===5){
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		gGamerPos.i = 0;
		gGamerPos.j = 5;
		// MOVING from current position
		
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
		return true;
	}
	else if (i===5&&j===-1){
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		gGamerPos.i = 5;
		gGamerPos.j = 11;
		// MOVING from current position
		
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
		return true;
	}
	else if (i===5&&j===12){
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		gGamerPos.i = 5;
		gGamerPos.j = 0;
		// MOVING from current position
		
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
		return true;
	}
	return false;
}
// Move the player to a specific location
function moveTo(i, j) {

	if (moveOnEdges(i, j)) return;
	
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!');
			updateScore();
			ballsCount--;
			if (ballsCount === 0) {
				endGame();
			}			
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		
		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;
	}
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	console.log('cellClass:', cellClass);
	return cellClass;
}

// Update the score in the UI 
function renderScore() {
	var elScore = document.getElementById('score');
    elScore.innerText = score;
}

// Update the score 
function updateScore() {
	score++;
	renderScore();
}

// Reset the game to initial state and score to 0
function resetGame(){
	clearInterval(interval);
	score = 0;
	initGame();
	renderScore();
}

// End the game
function endGame() {
    isGameRunning = false;
    console.log('Game Over!');
    alert('Game Over! Your Score is:'+ score);
    resetGame();
}
