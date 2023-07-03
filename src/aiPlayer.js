class AiPlayer {
    determineBestMove(game, playerId) {
        return [getRandomInt(7), getRandomInt(7)];
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = AiPlayer;