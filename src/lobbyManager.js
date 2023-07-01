const Lobby = import('./lobby');

class LobbyManager {
    constructor(host, qrCodeGenerator) {
        this.lobbies = {};
        this.url = host + '/lobby/';
        this.qrCodeGenerator = qrCodeGenerator;
    }

    getLobby(lobbyId) {
        return this.lobbies[lobbyId];
    }

    openLobby() {
        let unique = false;
        let lobbyId;
      
        while (!unique) {
          lobbyId = generateCode();
          
          if (!this.lobbies.hasOwnProperty(lobbyId)) {
            unique = true;
            this.lobbies[lobbyId] = createLobby(this.url + lobbyId);
            console.log("New unique code generated and added: ", lobbyId);
            return lobbyId;
          } else {
            console.log("Code already exists.");
          }
        }
    }

    closeLobby(lobbyId) {
        delete(this.lobbies[lobbyId])
    }
}

function generateCode() {
  let code = '';
  const characters = '123456789ABCDEF';
  
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return code;
}

function createLobby(url) {
  var lobby = new Lobby();

  QRCode.toDataURL(url, { version: 2 }, function (err, data) {
    lobby.qrCode = data;
    console.log(`Generated qr code for ${url}`);
  });

  return lobby;
}

module.exports = LobbyManager;