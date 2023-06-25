const session = require('express-session');
const express = require('express');
const http = require('http');
const uuid = require('uuid');

class HttpServer {
    constructor(port) {
        this.port = port;
        this.express = express();
        configServer();
    }

    configServer() {
        // Serve static files from the 'public' folder.
        this.express.use(express.static('public'));

        // We need the same instance of the session parser in express and
        // WebSocket server.
        this.sessionParser = session({
            saveUninitialized: false,
            secret: 'pdjhdsofndsub7ubnsijuh32u8sabdsjadjk3hk3hadksahkuai3hkuakhsbcbjmxz',
            resave: false
        });

        this.express.use(this.sessionParser);

        //
        // Create an HTTP server.
        //
        this.server = http.createServer(this.express);

        this.express.post('/login', this.handleLogin);
    }

    handleLogin(req, res) {
        //
        // "Log in" user and set userId to session.
        //
        if (!req.session.userId) {
          if(!req.query.type | !(req.query.type == 'player' | req.query.type == 'observer')) {
            return;
          }
          const id = uuid.v4();
          var playerType = req.query.type;
          req.session.userId = id;
          req.session.userType = playerType;
          console.log(`Updating session for user: ${id}, type: ${playerType}`);
        }
        res.send({ result: 'OK', message: 'Session updated' });
      }

    startServer() {
        //
        // Start the server.
        //
        this.server.listen(this.port, function () {
            console.log('Listening on http://localhost:8080');
        });
    }


  }
  
  module.exports = HttpServer;