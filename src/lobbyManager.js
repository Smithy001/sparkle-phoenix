const lobbyGame = require('./lobbyGame');
const path = require('path');

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
      console.log('Closing game: ' + gameId);
      delete(games[gameId]);
    }
}

function setupHttpServer(lobbyManager, httpServer) {
  httpServer.express.get('/games', (req, res) => {
    res.json(lobbyManager.getGames());
  });

  httpServer.express.post('/game/new', (req, res) => {
    var gameId = lobbyManager.newGame();
    var playerId = req.session.userId;
    res.json({status: "Success", redirect: '/game/' + gameId });
  });

  httpServer.express.get('/game/:gameId', (req, res) => {
    var thisGame = lobbyManager.getGame(req.params.gameId);
    console.log(thisGame);
    res.json(thisGame);
  });
  
  httpServer.express.get('/game/:gameId/player', (req, res) => {
    var gameId = req.params.gameId;
    if (gameId) {
      gameId = gameId.toUpperCase();
    } else {
      res.json({status: "Failed", message: 'Game id not found.'}); 
      return;
    }
    var thisGame = lobbyManager.getGame(gameId);
    console.log(thisGame);
    //res.json(thisGame);
    res.sendFile(path.resolve('public/player/index.html'));
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