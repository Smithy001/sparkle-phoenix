const uuid = require('uuid');
var players = {};
var theGame;
var eventLoop;

class Simulator {
    constructor() {
        console.log('Initializing simulation');
        this.interval = 1000;
    }

    startSim (game, playerCount) {
        this.playerCount;
        theGame = game;
        game.newGame(playerCount);

        for (let i = 0; i < this.playerCount; i++) {
            let id = uuid.v4();
            players[id] = 1;
            theGame.playerJoin(id);
        }
        eventLoop = setInterval(this.simulationTick, this.interval);
    }

    simulationTick() {
        console.log('tick');

        Object.keys(players).forEach(playerId => {
            console.log(`Processing player: ${playerId}`);
            theGame.endTurn(playerId, determineBestMove(), determineBestMove());
        });
    }

    processState(id, state) {
        if (id == 'observer') {
            return;
        }
        console.log('### Start processing state ###');
        console.log(id);
        console.log(state);

        if (state.alive == false) {
            console.log(`Deleting player: ${id}`);
            delete players[id];
        }

        if (Object.keys(players).length < 2) {
            console.log('Game over');
            clearInterval(eventLoop);
        }

        console.log('### End processing state ###');
    }

}

function determineBestMove() {
    return getRandomInt(7);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = Simulator;