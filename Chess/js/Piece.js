// TODO: Refactor to shorten and deduplicate code - Avraham.

class Piece {
	constructor(row, col, type, player) {
		this.row = row;
		this.col = col;
		this.type = type;
		this.player = player;
		this.turnCounter = 0;
	}

	getOpponent() {
		if (this.player === WHITE_PLAYER) {
			return BLACK_PLAYER;
		}
		return WHITE_PLAYER;
	}

	//checks if the direction the piece wants to go in has any free cells and
	//manipulates its movement options based on whether there are any enemy pieces in sight, on if its empty and on if there are any allies in sight
	getMovesInDirection(directionRow, directionCol, boardData) {
		let result = [];
		for (let i = 1; i < BOARD_SIZE; i++) {
			let row = this.row + directionRow * i;
			let col = this.col + directionCol * i;
			if (boardData.isEmpty(row, col)) {
				result.push([row, col]);
			} else if (boardData.isPlayer(row, col, this.getOpponent())) {
				result.push([row, col]);
				return result;
			} else if (boardData.isPlayer(row, col, this.player)) {
				return result;
			}
		}
		return result;
	}

	//gets pieces movement whike taking into considaration the boarddata and the cells in the way
	getPossibleMoves(boardData) {
		// Get moves
		let moves;
		if (this.type === PAWN) {
			moves = this.getPawnMoves(boardData);
		} else if (this.type === ROOK) {
			moves = this.getRookMoves(boardData);
		} else if (this.type === KNIGHT) {
			moves = this.getKnightMoves(boardData);
		} else if (this.type === BISHOP) {
			moves = this.getBishopMoves(boardData);
		} else if (this.type === KING) {
			moves = this.getKingMoves(boardData);
		} else if (this.type === QUEEN) {
			moves = this.getQueenMoves(boardData);
		} else {
			console.log("Unknown type", type);
		}

		// Get filtered absolute moves
		let filteredMoves = [];
		for (const absoluteMove of moves) {
			const absoluteRow = absoluteMove[0];
			const absoluteCol = absoluteMove[1];
			if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
				filteredMoves.push(absoluteMove);
			}
		}
		return filteredMoves;
	}

	getPawnMoves(boardData) {
		let result = [];
		let direction = 1;
		let position;
		if (this.player === BLACK_PLAYER) {
			direction = -1;
		}

		if (this.row === 6 || this.row === 1) {
			position = [
				[this.row + direction * 2, this.col],
				[this.row + direction, this.col],
			];
			if (boardData.isEmpty(position[0][0], position[0][1])) {
				result.push(position[0]);
			}
			if (boardData.isEmpty(position[1][0], position[1][1])) {
				result.push(position[1]);
			}
			position = [this.row + direction, this.col + direction];
			if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {
				result.push(position);
			}
			position = [this.row + direction, this.col - direction];
			if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {
				result.push(position);
			}
		} else {
			position = [this.row + direction, this.col];
			if (boardData.isEmpty(position[0], position[1])) {
				result.push(position);
			}

			position = [this.row + direction, this.col + direction];
			if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {
				result.push(position);
			}

			position = [this.row + direction, this.col - direction];
			if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {
				result.push(position);
			}
		}

		return result;
	}

	getRookMoves(boardData) {
		let result = [];
		result = result.concat(this.getMovesInDirection(-1, 0, boardData));
		result = result.concat(this.getMovesInDirection(1, 0, boardData));
		result = result.concat(this.getMovesInDirection(0, -1, boardData));
		result = result.concat(this.getMovesInDirection(0, 1, boardData));
		return result;
	}

	getKnightMoves(boardData) {
		let result = [];
		const relativeMoves = [
			[2, 1],
			[2, -1],
			[-2, 1],
			[-2, -1],
			[-1, 2],
			[1, 2],
			[-1, -2],
			[1, -2],
		];
		for (let relativeMove of relativeMoves) {
			let row = this.row + relativeMove[0];
			let col = this.col + relativeMove[1];
			if (!boardData.isPlayer(row, col, this.player)) {
				result.push([row, col]);
			}
		}
		return result;
	}

	getBishopMoves(boardData) {
		let result = [];
		result = result.concat(this.getMovesInDirection(-1, -1, boardData));
		result = result.concat(this.getMovesInDirection(-1, 1, boardData));
		result = result.concat(this.getMovesInDirection(1, -1, boardData));
		result = result.concat(this.getMovesInDirection(1, 1, boardData));
		return result;
	}

	getKingMoves(boardData) {
		let result = [];
		const relativeMoves = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1],
		];
		for (let relativeMove of relativeMoves) {
			let row = this.row + relativeMove[0];
			let col = this.col + relativeMove[1];
			if (!boardData.isPlayer(row, col, this.player)) {
				result.push([row, col]);
			}
		}
		if ((whiteRightRookDidntMove && whiteKingDidntMove) || (whiteLeftRookDidntMove && whiteKingDidntMove)) {
			if (this.player === WHITE_PLAYER) {
				result.push([0, 1]);
			}
			if (this.player === BLACK_PLAYER) {
				result.push([7, 1]);
			}
		}

		return result;
	}

	getQueenMoves(boardData) {
		let result = this.getBishopMoves(boardData);
		result = result.concat(this.getRookMoves(boardData));
		return result;
	}
}
