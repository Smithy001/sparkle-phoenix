class Player {
    constructor(id) {
      this.id = id;
      this.ship = null;
      this.color = "";
      this.alive = true;
      this.turnHasBeenSubmitted = false;
      this.winner = false;
    }
  }
  
  module.exports = Player;