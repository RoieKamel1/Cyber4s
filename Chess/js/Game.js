class Game {
	constructor(firstPlayer) {
		this.boardData = new BoardData();
		this.currentPlayer = firstPlayer;
		this.winner = undefined;
	}

	smallCastle = () => {
		const whiteKing = this.boardData.pieces[6];
		const whiteLeftRook = this.boardData.pieces[0];
		const blackKing = this.boardData.pieces[22];
		const blackLeftRook = this.boardData.pieces[16];
		if (whiteKing.row === 0 && whiteKing.col === 1) {
			whiteLeftRook.row = 0;
			whiteLeftRook.col = 2;
		}
		if (blackKing.row === 7 && blackKing.col === 1) {
			blackLeftRook.row = 7;
			blackLeftRook.col = 2;
		}
	};

	// Tries to actually make a move. Returns true if successful.
	tryMove(piece, row, col) {
		const possibleMoves = this.getPossibleMoves(piece);
		// possibleMoves looks like this: [[1,2], [3,2]]
		for (const possibleMove of possibleMoves) {
			// possibleMove looks like this: [1,2]
			if (possibleMove[0] === row && possibleMove[1] === col) {
				// There is a legal move
				const removedPiece = this.boardData.removePiece(row, col);
				piece.row = row;
				piece.col = col;

				if (piece.type === KING) {
					if (piece.player === BLACK_PLAYER) {
						blackKingDidntMove = false;
					}
					if (piece.player === WHITE_PLAYER) {
						whiteKingDidntMove = false;
					}
				}

				if (piece.type === ROOK) {
					if (piece.BLACK_PLAYER) {
						if (piece.col === 7) {
							let blackLeftRookDidntMove = false;
						}
						if (piece.col === 0) {
							let blackRightRookDidntMove = false;
						}
					}
					if (piece.WHITE_PLAYER) {
						if (piece.col === 7) {
							let whiteLeftRookDidntMove = false;
						}
						if (piece.col === 0) {
							let whiteRightRookDidntMove = false;
						}
					}
				}
				if (removedPiece !== undefined && removedPiece.type === KING) {
					this.winner = piece.player;
				}
				this.currentPlayer = piece.getOpponent();
				piece.turnCounter++;
				console.log(piece.turnCounter);
				this.smallCastle();
				return true;
			}
		}
		return false;
	}

	getPossibleMoves(piece) {
		if (this.currentPlayer !== piece.player || this.winner !== undefined) {
			return [];
		}
		return piece.getPossibleMoves(this.boardData);
	}
}
