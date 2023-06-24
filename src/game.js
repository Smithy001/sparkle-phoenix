const MapEntity = require("./mapEntity");

class Game {
  constructor(pushStateCallbackParameter) {
    this.expectedPlayers = 0;
    this.boardSize = 0;
    this.board = null;
    this.players = [];
    this.entites = [];
    this.pushStateCallback = pushStateCallbackParameter;
  }

  newGame(expectedPlayers) {
    this.expectedPlayers = expectedPlayers;
    this.boardSize = determineBoardSize();
    this.board = createBoard();
    this.acceptingNewPlayers = true;
    this.gameStarted = false;
  }

  determineBoardSize() {
    const boardSpacesForPlayerCount = this.expectedPlayers * 25;
    const bestBoardSize = Math.floor(Math.sqrt(boardSpacesForPlayerCount));

    return bestBoardSize;
  }

  createBoard() {
    const board = [];
    for (let x = 0; x < this.boardSize; x++) {
      const cellArray = [];
      for (let y = 0; y < this.boardSize; y++) {
        oneArray.push({ entities: [], shrapnelHasBeenAdded: false });
      }
      board.push(cellArray);
    }

    return board;
  }

  X X X
1 2 B X
4 O 6 X
7 8 9

  playerJoin(playerId) {
    if (!this.gameStarted) 
    {
      const player = new Player(playerId);
      this.players.push(player);

      if (this.players.length > this.expectedPlayers) {
        this.gameStarted = true;
        this.startGame();
      }
    }
  }

  startGame() {
    for (let i = 0; i < this.players; i++) {
      const xy = this.getXY();
      const direction = getRandomDirection();
      const player = this.players[i];
      player.color = determineColor(i);
      player.ship = new MapEntity({x:x, y:y, type: 'ship', direction:direction, owner: player})
  
      this.board[x][y].entites.push(player.ship);
    }

    pushCurrentState();
  }

  determineColor(index) {
    const colors = [
      "blue", 
      "red", 
      "brown", 
      "aqua", 
      "deeppink", 
      "orange", 
      "green",
      "mediumpurple",
      "darkred",
      "navy",
      "darkkhaki",
      "teal",
    ];

    return colors[index];
  }

  getPlacementXY() {
    var boardValue = -0;
    var highestBoardValue = -1000;
    var retVal = { x: 0, y: 0 };

    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        boardValue = getBoardPlacementValue(x, y);

        if (boardValue > highestBoardValue || highestBoardValue < 0) {
          highestBoardValue = boardValue;
          retVal.x = x;
          retVal.y = y;
        }
      }
    }

    return retVal;
  }

  getBoardPlacementValue(x, y) {
    const valueFromDistanceFromCenter = getValueFromDistanceFromCenter(x, y);
    const valueFromPlayerDistances = getValueFromPlayerDistances(x, y);
    const randomValue = getRandomValue(x, y);
    const value = 100 + valueFromDistanceFromCenter + valueFromPlayerDistances + randomValue;

    if (this.board[x][y].entites.length > 0) {
      return -1000;
    }
    else {
      return value;
    }
  }

  //'abc', 0, 0
  endTurn(id, moveDirection, shootDirection) {
    const player = findPlayer(id);
    const ship = player.ship;

    ship.moveDirection = moveDirection;
    ship.shootDirection = shootDirection;
    
    player.turnEnded = true;

    const allPlayersTurnsHaveEnded = determineIfAllPlayersHaveEndedTurn();
    if (allPlayersTurnsHaveEnded) {
      runNextTurn();
    }
  }

  runNextTurn() {
    //TODO: Calculate the turn

    pushCurrentState();
  }

  push() {
    this.pushStateToPlayers();
    this.pushStateToObservers();
  }

  pushStateToPlayers() {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      const playerState = getStateForOnePlayer(player);

      this.pushStateCallback(player.id, playerState);
    }
  }

  pushStateToObservers() {
    const observerState = getStateForObserver();
    this.pushStateCallback('observer', observerState);
  }

  getStateForOnePlayer(player) {
    const state = { alive:true, color:'blue' };

    return state;
  }

  getStateForObserver() {
    const state = {
      width: this.boardSize,
      height: this.boardSize,
      players: [],
      items: [],
    }

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      state.players.push({ id: player.id, color: player.color });
    }

    for (let i = 0; i < this.entites.length; i++) {
      const entity = this.entites[i];
      state.items.push({ id: entity.id, col: entity.x, row: entity.y, dir: entity.direction });
    }
          /*"width": 20,
          "height": 20,
          "players": [
      {"id": "abcd1", "color": "red"},
      {"id": "ef431", "color": "blue"},
      {"id": "123ef", "color": "green"},
      {"id": "adcb9", "color": "brown"}
      ],
      "items": [
      {"id": "abcd1", "col": 1, "row": 1, "dir": 4},
      {"id": "ef431", "col": 1, "row": 3, "dir": 0},
      {"id": "123ef", "col": 3, "row": 3, "dir": 3},
      {"id": "adcb9", "col": 5, "row": 3, "dir": 7},
      {"id": "bullet", "col": 8, "row": 5, "dir": 7},
      {"id": "bullet", "col": 12, "row": 15, "dir": 5}
      ]
      };*/

      return state;
  }
}

module.exports = Game;