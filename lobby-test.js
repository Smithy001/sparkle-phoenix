'use strict';

const HttpServer = require('./src/httpServer');
const WSManager = require('./src/wsManager');
const Game = require('./src/game');
const Common = require('./src/common');
const Sim = require('./src/simulator');
const QRCode = require('qrcode');
const LobbyManager = require('./src/lobbyManager');

// Command line arguments
const simMode = Common.getArgument('sim', false);
const observerMode = Common.getArgument('observe', false);
const playerCount = Common.getArgument('players', 2);
const simModeTickSpeed = Common.getArgument('tick', 2000);
const helpMode = Common.getArgument('help', false);
const shrapnelMode = Common.getArgument('no-shrapnel', false);
const address = Common.getArgument('addr', 'http://localhost:80');

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






var wsManager = new WSManager();

var httpServer = new HttpServer(80, wsManager);

var lobbyManager = new LobbyManager(address, QRCode, httpServer);

var lobbyCode = lobbyManager.openLobby(function(lobby){
    console.log(lobby);
});

var lobbyCode = lobbyManager.openLobby(function(lobby){
    console.log(lobby);
});

var lobbyCode = lobbyManager.openLobby(function(lobby){
    console.log(lobby);
});

var lobbyCode = lobbyManager.openLobby(function(lobby){
    console.log(lobby);
});

var lobbyCode = lobbyManager.openLobby(function(lobby){
    console.log(lobby);
});

var lobbyCode = lobbyManager.openLobby(function(lobby){
    console.log(lobby);
});

/*
setTimeout(function(){
    //console.log(lobbyCode);
    var lobby = lobbyManager.getLobby(lobbyCode);
    console.log(lobby);
    //lobbyManager.closeLobby(lobbyCode);
    console.log(lobbyManager.lobbies);
}, 1000);
*/

/*


*/

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

httpServer.startServer();

//game.newGame(playerCount);






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