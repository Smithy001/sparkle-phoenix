// game.js

class GameBoard {
    constructor(size) {
      this.size = size;
      this.entities = [];
      console.log("constructor param: " + size);
    }

    createBoard() {
      const board = [];
      for (let x = 0; x < this.size; x++) {
        const rowData = [];
        for (let y = 0; y < this.size; y++) {
          rowData.push({ ship: null, bullet: null });
        }
        board.push(rowData);
      }
      return board;
    }
  
    placePiece(x, y, piece) {
      if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
        throw new Error('Invalid position on the game board.');
      }
  
      if (piece.type === 'ship') {
        this.board[x][y].ship = piece;
      } else if (piece.type === 'bullet') {
        this.board[x][y].bullet = piece;
      } else {
        throw new Error('Invalid piece type. Only "ship" and "bullet" are allowed.');
      }
    }

    movePiece(oldX, oldY, newX, newY, pieceType) {
        if (this.coordinatesAreInvalid(oldX, oldY) || this.coordinatesAreInvalid(newX, newY)) {
            throw new Error('Invalid position on the game board.');
        }

        
    }

    coordinatesAreInvalid(x, y) {
        if (x < 0 || x > this.size || y < 0 || y > this.size) {
            return true;
        }
        else {
            return false;
        }
    }
  }
  
  module.exports = GameBoard;