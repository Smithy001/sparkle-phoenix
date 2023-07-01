const Lobby = require('./lobby');

var lobbies = {};

class LobbyManager {
    constructor(host, qrCodeGenerator, httpServer) {
        this.url = appendSlashIfMissing(host) + 'lobby/';
        this.qrCodeGenerator = qrCodeGenerator;
        this.httpServer = httpServer;
    }

    getLobby(lobbyId) {
        return lobbies[lobbyId];
    }

    openLobby() {
        let unique = false;
        let lobbyId;
      
        while (!unique) {
          lobbyId = generateCode();
          
          if (!lobbies.hasOwnProperty(lobbyId)) {
            unique = true;
            lobbies[lobbyId] = createLobby(this.qrCodeGenerator, this.url + lobbyId);
            console.log("New unique code generated and added: ", lobbyId);
            return lobbyId;
          } else {
            console.log("Code already exists.");
          }
        }
    }

    closeLobby(lobbyId) {
        delete(lobbies[lobbyId]);
    }
}

function appendSlashIfMissing(str) {
  if (str.charAt(str.length - 1) !== '/') {
    return str + '/';
  }
  return str;
}

function generateCode() {
  let code = '';
  const characters = '123456789ABCDEF';
  
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return code;
}

function createLobby(qrCodeGenerator, url) {
  console.log(url);
  var lobby = new Lobby();

  qrCodeGenerator.toDataURL(url, { version: 2 }, function (err, data) {
    console.log(`Generated qr code for ${url}`);
    lobby.qrCode = data;
    lobby.ready = true;
  });

  return lobby;
}

module.exports = LobbyManager;