'use strict';

const HttpServer = require('./src/httpServer');
const WSManager = require('./src/wsManager');
const Game = require('./src/game');
const Common = require('./src/common');
const Sim = require('./src/simulator');
const isSim = (process.argv.indexOf('-sim') > -1);
const playerCount = Common.getPlayerCount();

if (isSim) {
  console.log(Sim);
  var sim = new Sim();

  var game = new Game(function(id, state) {
    console.log(`Callback = ID: ${id}`);
    console.log(state);
    sim.processState(id, state);
  });

  sim.startSim(game, playerCount);
} else {

  var wsManager = new WSManager();

  var httpServer = new HttpServer(80, wsManager);

  httpServer.startServer();

  var game = new Game(function(id, state) {
    console.log(`Callback = ID: ${id}`);
    console.log(state);
    wsManager.sendMessage(id, state);
  });

  wsManager.addFunction('playerJoin', function(id) {
    console.log('Adding player');
    game.playerJoin(id);
  });

  wsManager.addFunction('playerEndTurn', function(message) {
    console.log('Player ending turn');
    console.log(message);
    if (message && message.playerId && message.moveDir != null && message.fireDir != null) {
      game.endTurn(message.playerId, message.moveDir, message.fireDir);
    }
  })
  
  game.newGame(playerCount);
}





/*

app.delete('/logout', function (request, response) {
  const ws = map.get(request.session.userId);

  console.log('Destroying session');
  request.session.destroy(function () {
    if (ws) ws.close();

    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});
*/