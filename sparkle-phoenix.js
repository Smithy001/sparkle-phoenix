'use strict';

const uuid = require('uuid');
const HttpServer = require('./src/httpServer');
const WSManager = require('./src/wsManager');
const Game = require('./src/game');
const Common = require('./src/common');
const Sim = require('./src/simulator');
const AiPlayer = require('./src/aiPlayer');
const simMode = Common.getArgument('sim', false);
const observerMode = Common.getArgument('observe', false);
const playerCount = Common.getArgument('players', 2);
const playerCountAI = Common.getArgument('ai-players', 0);
const simModeTickSpeed = Common.getArgument('tick', 2000);
const helpMode = Common.getArgument('help', false);
const shrapnelMode = Common.getArgument('no-shrapnel', false);

const aiPlayer = new AiPlayer();

if (helpMode) {
  console.log(`
  Sparkle Phoenix

  args:
  -players [number]     Player count
  -ai-players [number]  Number of AI Players
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
  var sim = new Sim(simModeTickSpeed, aiPlayer);

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

  

  var aiPlayers = [];

  var game = new Game(function(id, state) {
    console.log(`Callback = ID: ${id}`);
    console.log(state);
    if (aiPlayers.includes(id)) {
      console.log('Making move for AI player');
      let newMove = aiPlayer.determineBestMove(game, id);
      game.endTurn(id, newMove[0], newMove[1]);
    }
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
  
  httpServer.startServer();

  game.newGame(playerCount);
  
  generateAIPlayers(game, aiPlayers);
}

function generateAIPlayers(game, aiPlayers) {
  let newId;
  while (aiPlayers.length < playerCountAI) {
    newId = uuid.v4();
    
    if (!aiPlayers.includes(newId)) {
      console.log('Adding a new AI player with ID: ' + newId);
      aiPlayers.push(newId);
      game.playerJoin(newId);
    }
  }
}