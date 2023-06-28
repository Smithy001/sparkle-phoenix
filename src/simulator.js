const uuid = require('uuid');

class Simulator {
    constructor(players) {
        console.log('Initializing simulation');
        this.players = [];
        this.interval = 100;
        this.players = players;
    }

    startSim () {
        for (let i = 0; i < this.players; i++) {
            let id = uuid.v4();
            this.players.push(id)
            this.game.playerJoin(id);
        }
        this.setInterval(this.simulationTick, this.interval);
    }

    simulationTick() {

    }

    simProcessState() {

    }

    determineBestMove() {
        return [this.getRandomInt(7), this.getRandomInt(7)];
    }

    addGame(game) {
        this.game = game;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

module.exports = Simulator;