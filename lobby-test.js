const QRCode = require('qrcode');
const LobbyManager = require('./src/lobbyManager');

var lobbyManager = new LobbyManager('test', QRCode);

var lobbyCode = lobbyManager.openLobby();
var lobby = lobbyManager.getLobby(lobbyCode);

console.log(lobbyCode);
console.log(lobby);

lobbyManager.closeLobby(lobbyCode);

console.log(lobbyManager.lobbies);