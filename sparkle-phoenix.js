'use strict';

const HttpServer = require('./src/httpServer');
const WSManager = require('./src/wsManager');
const Game = require('./src/game');
const Common = require('./src/common');
const Sim = require('./src/simulator');
const simMode = Common.getArgument('sim', false);
const observerMode = Common.getArgument('observe', false);
const playerCount = Common.getArgument('players', 2);
const simModeTickSpeed = Common.getArgument('tick', 2000);
const helpMode = Common.getArgument('help', false);
const shrapnelMode = Common.getArgument('no-shrapnel', false);

if (helpMode) {
  console.log(`
  Sparkle Phoenix

  args:
  -players [number]     Player count
  -sim                  Simulation mode
  -observe              Wait for an observer to join before starting Simulation mode
  -tick [number]        Milliseconds to wait between each making each move during Simulation mode
  -no-shrapnel          Removes shrapnel from explosions
  `);
  process.exit();
}

if (simMode) {
  var wsManager = new WSManager();
  var httpServer = new HttpServer(80, wsManager);
  var sim = new Sim(simModeTickSpeed);

  httpServer.startServer();

  var game = new Game(function(id, state) {
    console.log(`Callback = ID: ${id}`);
    console.log(state);
    sim.processState(id, state);

    if (id == 'observer') {
      wsManager.sendMessage(id, state);
    }
  }, function(){process.exit()}, shrapnelMode);

  if (observerMode) {
    console.log('Simulation Observer mode, waiting for observer to join...');
    wsManager.addFunction('ObserverJoin', function(id) {
      console.log('Observer has joined, starting game.');
      sim.startSim(game, playerCount);
    });
  } else {
    sim.startSim(game, playerCount);
  }
} else {

  var wsManager = new WSManager();

  var httpServer = new HttpServer(80, wsManager);

  httpServer.startServer();

  var game = new Game(function(id, state) {
    console.log(`Callback = ID: ${id}`);
    console.log(state);
    wsManager.sendMessage(id, state);
  }, function(){process.exit()}, shrapnelMode);

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