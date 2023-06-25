const MapEntity = require("./mapEntity");

class Game {
  constructor(pushStateCallbackParameter) {
    this.expectedPlayers = 0;
    this.boardSize = 0;
    this.board = null;
    this.players = [];
    this.entities = [];
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
        cellArray.push({ entities: [], shrapnelHasBeenAdded: false });
      }
      board.push(cellArray);
    }

    return board;
  }
/*
  X X X
1 2 B X
4 O 6 X
7 8 9
*/
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
  
      this.board[x][y].entities.push(player.ship);
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

    if (this.board[x][y].entities.length > 0) {
      return -1000;
    }
    else {
      return value;
    }
  }

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

  findPlayer(id) {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (player.id == id) {
        return player;
      }
    }

    return null;
  }

  runNextTurn() {
    //Move everything and ships fire missiles
    everythingMovesAndShoots();

    //Decide on explosions and/or add shrapnels
    determineWhatExplodesAndAddShrapnel();

    pushCurrentState();
  }

  everythingMovesAndShoots() {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      const newLocation = getNewLocationFromDirection(entity, entity.moveDirection);
      const newLocationIsOnTheMap = determineNewLocationIsOnTheMap(newLocation);

      if (newLocationIsOnTheMap) {
        moveOneEntity(entity.x, entity.y, newLocation);
      }
      else {
        entity.needsToExplode = true;
      }

      if (entity.type == 'ship') {
        shootMissle(entity);
      }
    }
  }

  getNewLocationFromDirection(x, y, direction) {
    const newLocation = { x: x, y: y };

    switch (direction) {
      case 0:
        newLocation.y -= 1; 
        break;
      case 1:
        newLocation.y -= 1;
        newLocation.x += 1;
        break;
      case 2:
        newLocation.x += 1;
        break;
      case 3:
        newLocation.x += 1;
        newLocation.y += 1;
        break;
      case 4:
        newLocation.y += 1;
        break;
      case 5:
        newLocation.x -= 1;
        newLocation.y += 1;
        break;
      case 6:
        newLocation.x -= 1;
        break;
      case 7:
        newLocation.x -= 1;
        newLocation.y -= 1;
        break;
    }

    return newLocation;
  }

  moveOneEntity (entity, newLocation) {
    const cell = this.board[entity.x][entity.y];
    const index = cell.indexOf(entity);

    if (index > -1) {
      cell.entities.splice(index, 1);
    }

    entity.x = newLocation.x;
    entity.y = newLocation.y;

    this.board[entity.x][entity.y].entities.push(entity);
  }

  shootMissile(entity) {
    const locationOfMissile = this.getNewLocationFromDirection(entity.x, entity.y, entity.shootDirection);
    const missile = new MapEntity({x:locationOfMissile.x, y:locationOfMissile.y, type: 'missile', direction:entity.shootDirection})
    
    this.board[entity.x][entity.y].entities.push(missile);
  }

  //shrapnelHasBeenAdded
  determineWhatExplodesAndAddShrapnel() {
    const needsShrapnel = [];

    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        const cell = this.board[x][y];
        var cellExplodes = false;
        
        if (cell.entities.length > 1) {
          cellExplodes = true;
        }

        if (!cellExplodes) {
          for (let i = 0; i < cell.entities.length; i++) {
            const entity = cell.entities[i];
  
            if (entity.needsToExplode) {
              cellExplodes = true;
            }
          }
        }

        if (cellExplodes) {
          this.addShrapnelForExplosion(x, y, needsShrapnel);
        }
      }
    }

    for (let i = 0; i < needsShrapnel.length; i++) {
      //everything in each of these cells goes away and instead a single missle is placed
      const shrapnelCell = needsShrapnel[i];
      const explodingCell = this.board[shrapnelCell.x][shrapnelCell.y];
      killEverythingInCell(explodingCell);

      const shrapnel = new MapEntity(shrapnelCell.x, shrapnelCell.y, 'shrapnel', shrapnelCell.direction);
      explodingCell.entities.push(shrapnel);
    }
  }

  killEverythingInCell(explodingCell) {
    for (let i = 0; i < explodingCell.entities.length; i++) {
      const entity = explodingCell.entities[i];

      if (entity.type == 'ship') {
        entity.owner.alive = false;
      }
    }

     explodingCell.entities = [];
  }

  addShrapnelForExplosion(x, y, needsShrapnel) {
    for (let direction = 0; direction <= 7; direction++) {
      const newLocation = getNewLocationFromDirection(x, y, direction);
      
      if (validXY(otherX, otherY)) {
        needsShrapnel.push( { x: newLocation.x, y: newLocation.y, direction: direction});
      }
    }
  }

  validXY(x, y) {
    if (x > this.boardSize || x < 0 || y > this.boardSize || y < 0) {
      return false;
    }
    else {
      return true;
    }
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
    const state = { alive:player.alive, color:player.color };

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

    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      state.items.push({ id: entity.id, col: entity.x, row: entity.y, dir: entity.moveDirection });
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