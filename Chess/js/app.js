const BOARD_SIZE = 8;
const WHITE_PLAYER = "white";
const BLACK_PLAYER = "black";

const PAWN = "pawn";
const ROOK = "rook";
const KNIGHT = "knight";
const BISHOP = "bishop";
const KING = "king";
const QUEEN = "queen";

let selectedCell;
let pieces = [];
let boardData;
let table;

class Piece {
	constructor(row, col, type, player) {
		this.row = row;
		this.col = col;
		this.type = type;
		this.player = player;
	}

	getPossibleMoves() {
		let relativeMoves;
		if (this.type === PAWN) {
			relativeMoves = this.getPawnRelativeMoves();
		} else if (this.type === ROOK) {
			relativeMoves = this.getRookRelativeMoves();
		} else if (this.type === KNIGHT) {
			relativeMoves = this.getKnightRelativeMoves();
		} else if (this.type === BISHOP) {
			relativeMoves = this.getBishopRelativeMoves();
		} else if (this.type === KING) {
			relativeMoves = this.getKingRelativeMoves();
		} else if (this.type === QUEEN) {
			relativeMoves = this.getQueenRelativeMoves();
		} else {
			console.log("Unknown type", type);
		}
		console.log("relativeMoves", relativeMoves);

		let absoluteMoves = [];
		for (let relativeMove of relativeMoves) {
			const absoluteRow = this.row + relativeMove[0];
			const absoluteCol = this.col + relativeMove[1];
			absoluteMoves.push([absoluteRow, absoluteCol]);
		}
		console.log("absoluteMoves", absoluteMoves);

		let filteredMoves = [];
		for (let absoluteMove of absoluteMoves) {
			const absoluteRow = absoluteMove[0];
			const absoluteCol = absoluteMove[1];
			if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
				filteredMoves.push(absoluteMove);
			}
		}
		console.log("filteredMoves", filteredMoves);
		return filteredMoves;
	}

	getPawnRelativeMoves() {
		let direction = 1;
		if (this.player == WHITE_PLAYER) {
			direction = 1;
		} else {
			direction = -1;
		}
		return [[1 * direction, 0]];
	}

	getRookRelativeMoves() {
		let result = [];
		for (let i = 1; i < BOARD_SIZE; i++) {
			result.push([i, 0]);
			result.push([-i, 0]);
			result.push([0, i]);
			result.push([0, -i]);
		}
		return result;
	}
	getKingRelativeMoves() {
		let result = [];
		result.push([1, 0]);
		result.push([1, 1]);
		result.push([0, 1]);
		result.push([-1, 0]);
		result.push([-1, -1]);
		result.push([0, -1]);
		result.push([-1, 1]);
		result.push([1, -1]);
		return result;
	}

	getBishopRelativeMoves() {
		let result = [];
		for (let i = 1; i < BOARD_SIZE; i++) {
			result.push([-i, -i]);
			result.push([-i, i]);
			result.push([i, i]);
			result.push([i, -i]);
		}
		return result;
	}

	getQueenRelativeMoves() {
		let result = [];
		for (let i = 1; i < BOARD_SIZE; i++) {
			result.push([i, 0]);
			result.push([-i, 0]);
			result.push([0, i]);
			result.push([0, -i]);
			result.push([-i, -i]);
			result.push([-i, i]);
			result.push([i, i]);
			result.push([i, -i]);
		}
		return result;
	}

	getKnightRelativeMoves() {
		let result = [];
		result.push([-2, 1]);
		result.push([1, -2]);
		result.push([1, 2]);
		result.push([2, 1]);
		result.push([-2, -1]);
		result.push([-1, -2]);
		result.push([-1, 2]);
		result.push([2, -1]);
		return result;
	}
}

class BoardData {
	constructor(pieces) {
		this.pieces = pieces;
	}

	// Returns piece in row, col, or undefined if not exists.
	getPiece(row, col) {
		for (const piece of this.pieces) {
			if (piece.row === row && piece.col === col) {
				return piece;
			}
		}
	}
}

function getInitialPieces() {
	let result = [];
	addFirstRowPieces(result, 0, WHITE_PLAYER);
	addFirstRowPieces(result, 7, BLACK_PLAYER);

	for (let i = 0; i < BOARD_SIZE; i++) {
		result.push(new Piece(1, i, PAWN, WHITE_PLAYER));
		result.push(new Piece(6, i, PAWN, BLACK_PLAYER));
	}
	return result;
}

function addFirstRowPieces(result, row, player) {
	result.push(new Piece(row, 0, ROOK, player));
	result.push(new Piece(row, 1, KNIGHT, player));
	result.push(new Piece(row, 2, BISHOP, player));
	result.push(new Piece(row, 3, KING, player));
	result.push(new Piece(row, 4, QUEEN, player));
	result.push(new Piece(row, 5, BISHOP, player));
	result.push(new Piece(row, 6, KNIGHT, player));
	result.push(new Piece(row, 7, ROOK, player));
}

function addImage(cell, player, name) {
	const image = document.createElement("img");
	image.src = "images/" + player + "/" + name + ".png";
	cell.appendChild(image);
}

function onCellClick(event, row, col) {
	console.log(row);
	console.log(col);
	for (let i = 0; i < BOARD_SIZE; i++) {
		for (let j = 0; j < BOARD_SIZE; j++) {
			table.rows[i].cells[j].classList.remove("possible-move");
		}
	}

	const piece = boardData.getPiece(row, col);
	if (piece !== undefined) {
		let possibleMoves = piece.getPossibleMoves();
		for (let possibleMove of possibleMoves) {
			const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
			cell.classList.add("possible-move");
		}
	}

	// Clear previously selected cell
	if (selectedCell !== undefined) {
		selectedCell.classList.remove("selected");
	}

	// Show selected cell
	selectedCell = event.currentTarget;
	selectedCell.classList.add("selected");
}

// function movePiece() {
// possibleMoves.forEach((possibleMove) => {
// 	possibleMove.addEventListener("click", () => {
// 		if (getelementbyclassname("possible-move")) {
// 			selectedCell.addImage(cell, piece.player, piece.type);
// 		}
// 	});
// });
// }

function createChessBoard() {
	table = document.createElement("table");
	document.body.appendChild(table);
	for (let row = 0; row < BOARD_SIZE; row++) {
		const rowElement = table.insertRow();
		for (let col = 0; col < BOARD_SIZE; col++) {
			const cell = rowElement.insertCell();
			cell.id = "cell-" + row.toString() + "_" + col.toString();
			if ((row + col) % 2 === 0) {
				cell.className = "light-cell";
			} else {
				cell.className = "dark-cell";
			}
			cell.addEventListener("click", (event) => onCellClick(event, row, col));
		}
	}

	// Create list of pieces (32 total)
	boardData = new BoardData(getInitialPieces());
	// pieces = getInitialPieces();

	for (let piece of boardData.pieces) {
		const cell = table.rows[piece.row].cells[piece.col];
		addImage(cell, piece.player, piece.type);
	}
}

window.addEventListener("load", createChessBoard);
