// gameBoard.js

class GameBoard {
    constructor(test) {
      this.board = this.createBoard();
      console.log("constructor param: " + test);
    }
  
    newGame() {
        console.log('Starting a new game');
    }

    createBoard() {
      const board = [];
      for (let row = 0; row < 10; row++) {
        const rowData = [];
        for (let col = 0; col < 10; col++) {
          rowData.push({ ship: null, bullet: null });
        }
        board.push(rowData);
      }
      return board;
    }
  
    placePiece(row, col, piece, direction) {
      if (row < 0 || row >= 10 || col < 0 || col >= 10) {
        throw new Error('Invalid position on the game board.');
      }
  
      if (piece === 'ship') {
        this.board[row][col].ship = { direction };
      } else if (piece === 'bullet') {
        this.board[row][col].bullet = { direction };
      } else {
        throw new Error('Invalid piece type. Only "ship" and "bullet" are allowed.');
      }
    }
  
    getPiece(row, col, piece) {
      if (row < 0 || row >= 10 || col < 0 || col >= 10) {
        throw new Error('Invalid position on the game board.');
      }
  
      if (piece === 'ship') {
        return this.board[row][col].ship;
      } else if (piece === 'bullet') {
        return this.board[row][col].bullet;
      } else {
        throw new Error('Invalid piece type. Only "ship" and "bullet" are allowed.');
      }
    }
  }
  
  module.exports = GameBoard;