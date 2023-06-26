const MapEntity = require("./mapEntity");
const Player = require("./player");
const ShipType = 'ship';
const BulletType = 'bullet';

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
    console.log(`Starting new Game with ${expectedPlayers} players`);
    this.expectedPlayers = expectedPlayers;
    this.boardSize = this.determineBoardSize();
    this.board = this.createBoard();
    this.acceptingNewPlayers = true;
    this.gameStarted = false;
  }

  determineBoardSize() {
    const boardSpacesForPlayerCount = this.expectedPlayers * 25;
    console.log(`Target board spaces is ${boardSpacesForPlayerCount}`);
    const bestBoardSize = Math.floor(Math.sqrt(boardSpacesForPlayerCount));

    return bestBoardSize;
  }

  createBoard() {
    const boardSpaces = this.boardSize * this.boardSize;
    console.log(`Creating board of ${this.boardSize} by ${this.boardSize} with ${boardSpaces} spaces.`);
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
    console.log(`player with id of ${playerId} is attempting to join`);
    if (!this.gameStarted)
    {
      const player = new Player(playerId);
      this.players.push(player);

      console.log(`game has not started, allowing ${playerId} to join. We now have ${this.players.length} players.`);

      if (this.players.length >= this.expectedPlayers) {
        console.log(`We have reached expected player count, starting game.`);
        this.gameStarted = true;
        this.startGame();
      }
    }
  }

  startGame() {
    console.log(`STARTING GAME, PLACING SHIPS FOR ALL PLAYERS`);
    for (let i = 0; i < this.players.length; i++) {      
      const player = this.players[i];
      console.log(`========PLACING ${player.id}========`);
      const xy = this.getPlacementXY();
      const direction = this.getRandomDirection();
    
      console.log(`Attempting to place a ship at ${xy.x},${xy.y} facing ${direction}`);

      player.color = this.determineColor(i);
      player.ship = new MapEntity(xy.x, xy.y, ShipType, direction, player, player.color);
      console.log(player.ship);
      //console.log(`Placed a ship (${player.ship}) for ${player.id} at ${player.ship.x},${player.ship.y} facing ${player.ship.direction}`);
  
      this.board[xy.x][xy.y].entities.push(player.ship);
      this.entities.push(player.ship);
    }

    this.push();
  }

  getRandomDirection() {
    const rng = Math.random();
    const direction = Math.floor(rng * 7);

    return direction;
  }

  determineColor(index) {
    const colors = [
      'blue', 
      'red', 
      'brown', 
      'aqua', 
      'deeppink', 
      'orange', 
      'green',
      'mediumpurple',
      'darkred',
      'navy',
      'darkkhaki',
      'teal',
    ];

    return colors[index];
  }

  getPlacementXY() {
    var boardValue = -0;
    var highestBoardValue = -1000;
    var retVal = { x: 0, y: 0 };

    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        boardValue = this.getBoardPlacementValue(x, y);

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
    const valueFromDistanceFromCenter = this.getValueFromDistanceFromCenter(x, y);
    const valueFromPlayerDistances = this.getValueFromPlayerDistances(x, y);
    const randomValue = this.getRandomValue();
    const value = valueFromDistanceFromCenter + valueFromPlayerDistances + randomValue;

    if (this.board[x][y].entities.length > 0) {
      return -1000;
    }
    else {
      return value;
    }
  }

  getRandomValue() {
    const rng = Math.random();
    const normalizedRng = (rng - 0.5) / 10;

    /*should generate a value between -0.05 and 0.05, 
    on smaller maps this will just choose between equally valued other positions as there isn't enough room to play with.
    However, on larger maps this should be enough to alter positions by up to 1 square.

    */

    return normalizedRng;
  }

  getValueFromPlayerDistances(x, y) {
    var totalPlayerDistancePercentages = 0;
    const maxPossibleDistance = this.getDistance(0, 0, this.boardSize - 1, this.boardSize - 1);

    for (let i = 0; i < this.entities.length; i++) {
      const otherShip = this.entities[i];
      const distanceToOtherShip = this.getDistance(x, y, otherShip.x, otherShip.y);
      const distancePct = distanceToOtherShip / maxPossibleDistance;

      totalPlayerDistancePercentages += distancePct;
    }

    const playerDistanceEffect = totalPlayerDistancePercentages / this.entities.length;

    return playerDistanceEffect;
  }

  getValueFromDistanceFromCenter(x, y) {
    const centerCoordinate = Math.floor(this.boardSize / 2);
    const distance = this.getDistance(x, y, centerCoordinate, centerCoordinate);
    const maxDistance = this.getDistance(0, 0, centerCoordinate, centerCoordinate);
    const distanceEffect = distance / maxDistance;

    return distanceEffect;
  }

  getDistance(x, y, targetX, targetY) {
    const xd = Math.abs(x - targetX) ^ 2;
    const yd = Math.abs(y - targetY) ^ 2;
    const distance = Math.sqrt(xd + yd);

    return distance;
  }

  endTurn(id, moveDirection, shootDirection) {
    //console.log(`player ${id} submitted turn: move=${moveDirection}, shoot=${shootDirection}`);
    const player = this.findPlayer(id);
    //console.log(`found player with id ${player.id}. ship is ${player.ship}`);
    if (player.alive) {
      const ship = player.ship;

      ship.moveDirection = moveDirection;
      ship.shootDirection = shootDirection;
      
      player.turnHasBeenSubmitted = true;
  
      const allPlayersTurnsHaveEnded = this.determineIfAllPlayersHaveEndedTurn();
      if (allPlayersTurnsHaveEnded) {
        this.runNextTurn();
      }
    }
  }

  determineIfAllPlayersHaveEndedTurn() {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (!player.turnHasBeenSubmitted) {
        return false;
      }
    }

    return true;
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
    //Move everything and ships fire bullets
    this.everythingMovesAndShoots();

    //Decide on explosions and/or add shrapnels
    this.determineWhatExplodesAndAddShrapnel();

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (player.alive) {
        player.turnHasBeenSubmitted = false;
      }
    }

    this.push();
  }

  everythingMovesAndShoots() {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      const newLocation = this.getNewLocationFromDirection(entity.x, entity.y, entity.moveDirection);
      const newLocationIsOnTheMap = this.validXY(newLocation.x, newLocation.y);

      if (newLocationIsOnTheMap) {
        this.moveOneEntity(entity, newLocation);
      }
      else {
        entity.needsToExplode = true;
      }

      if (entity.type == ShipType) {
        this.shootBullet(entity);
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
    //console.log(entity);
    const cell = this.board[entity.x][entity.y];
    //console.log(cell);
    const index = cell.entities.indexOf(entity);

    if (index > -1) {
      cell.entities.splice(index, 1);
    }

    entity.x = newLocation.x;
    entity.y = newLocation.y;

    const newCell = this.board[entity.x][entity.y];
    newCell.entities.push(entity);
  }

  shootBullet(entity) {
    const locationOfBullet = this.getNewLocationFromDirection(entity.x, entity.y, entity.shootDirection);
    const xyIsValid = this.validXY(locationOfBullet.x, locationOfBullet.y);

    if (xyIsValid) {
      console.log(`adding bullet to ${locationOfBullet.x}, ${locationOfBullet.y}.`);
      const bullet = new MapEntity(locationOfBullet.x, locationOfBullet.y, BulletType, entity.shootDirection, null, null);
      
      this.board[locationOfBullet.x][locationOfBullet.y].entities.push(bullet);
      this.entities.push(bullet);
    }
    else {
      console.log(`cannot add bullet to ${locationOfBullet.x}, ${locationOfBullet.y}, nothing is done instead.`);
    }
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
          this.killEverythingInCell(cell);
          this.addShrapnelForExplosion(x, y, needsShrapnel);
        }
      }
    }

    for (let i = 0; i < needsShrapnel.length; i++) {
      //everything in each of these cells goes away and instead a single missle is placed
      const shrapnelCell = needsShrapnel[i];
      const explodingCell = this.board[shrapnelCell.x][shrapnelCell.y];
      this.killEverythingInCell(explodingCell);

      const shrapnel = new MapEntity(shrapnelCell.x, shrapnelCell.y, 'shrapnel', shrapnelCell.direction);
      explodingCell.entities.push(shrapnel);
    }
  }

  killEverythingInCell(explodingCell) {
    for (let i = 0; i < explodingCell.entities.length; i++) {
      const entity = explodingCell.entities[i];

      if (entity.type == ShipType) {
        this.killPlayer(entity.owner);
        entity.owner.alive = false;
      }

      const index = this.entities.indexOf(entity);

      if (index > -1) {
        this.entities.splice(entity, 1);
      }
    }

     explodingCell.entities = [];
  }

  killPlayer(player) {
    console.log(`Player ${player.id} has died`);
    player.alive = false;
    player.turnHasBeenSubmitted = true;
    player.ship = null;
  }

  addShrapnelForExplosion(x, y, needsShrapnel) {
    for (let direction = 0; direction <= 7; direction++) {
      const newLocation = this.getNewLocationFromDirection(x, y, direction);
      
      if (this.validXY(newLocation.x, newLocation.y)) {
        needsShrapnel.push( { x: newLocation.x, y: newLocation.y, direction: direction});
      }
    }
  }

  validXY(x, y) {
    if (x >= this.boardSize || x < 0 || y >= this.boardSize || y < 0) {
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
      const playerState = this.getStateForOnePlayer(player);

      this.pushStateCallback(player.id, playerState);
    }
  }

  pushStateToObservers() {
    const observerState = this.getStateForObserver();
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
      
      if (entity.type == ShipType) {
        state.items.push({ id: entity.owner.id, col: entity.x, row: entity.y, dir: entity.moveDirection });
      }
      else {
        state.items.push({ id: BulletType, col: entity.x, row: entity.y, dir: entity.moveDirection });
      }
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