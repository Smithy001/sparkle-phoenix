const uuid = require('uuid');
var players = {};
var theGame;
var eventLoop;
var AiPlayer;

class Simulator {
    constructor(tickSpeed, AiPlayerClass) {
        console.log('Initializing simulation');
        this.interval = tickSpeed;
        AiPlayer = AiPlayerClass;
    }

    startSim (game, playerCount) {
        if (this.running) {
            return;
        }
        
        this.running = true;
        this.playerCount = playerCount;
        theGame = game;
        game.newGame(this.playerCount);

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
            var bestMove = AiPlayer.determineBestMove(theGame, playerId);
            theGame.endTurn(playerId, bestMove[0], bestMove[1]);
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
        }

        console.log('### End processing state ###');
    }

}

module.exports = Simulator;