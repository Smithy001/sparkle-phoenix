const lobbyGame = require('./lobbyGame');

var games = {};

class LobbyManager {
    constructor(host, qrCodeGenerator, httpServer) {
      this.url = appendSlashIfMissing(host) + 'game/';
      this.qrCodeGenerator = qrCodeGenerator;
      this.httpServer = httpServer;
      console.log('Initializing LobbyManager');

      setupHttpServer(this, httpServer);
    }

    getGame(gameId) {
      return games[gameId];
    }

    getGames() {
      var retGames = [];

      Object.keys(games).forEach(gameId => {
        retGames.push(gameId);
      });

      return retGames;
    }

    newGame(callback) {
      let unique = false;
      let gameId;
    
      while (!unique) {
        gameId = generateCode();
        
        if (!games.hasOwnProperty(gameId)) {
          unique = true;
          games[gameId] = createGame(this.qrCodeGenerator, this.url + gameId, callback);
          console.log("New unique code generated and added: ", gameId);
          return gameId;
        } else {
          console.log("Code already exists.");
        }
      }
    }

    closeGame(gameId) {
      delete(games[gameId]);
    }
}

function setupHttpServer(lobbyManager, httpServer) {
  httpServer.express.get('/games', (req, res) => {
    res.json(lobbyManager.getGames());
  });
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

function createGame(qrCodeGenerator, url, callback) {
  console.log(url);
  var game = new lobbyGame();
  
  qrCodeGenerator.toDataURL(url, function (err, data) {
    console.log(`Generated qr code for ${url}`);
    game.qrCode = data;
    game.ready = true;
    callback(data);
  });

  return game;
}

module.exports = LobbyManager;