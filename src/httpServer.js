const session = require('express-session');
const express = require('express');
const http = require('http');
const uuid = require('uuid');
var wsManager;

sessionParser = session({
    saveUninitialized: false,
    secret: 'pdjhdsofndsub7ubnsijuh32u8sabdsjadjk3hk3hadksahkuai3hkuakhsbcbjmxz',
    resave: false
});

class HttpServer {
    constructor(port, wsm) {
        wsManager = wsm;

        this.port = port;
        this.express = express();
        this.configServer();
    }

    configServer() {
        // Serve static files from the 'public' folder.
        this.express.use(express.static('public'));

        this.express.use(sessionParser);

        //
        // Create an HTTP server.
        //
        this.server = http.createServer(this.express);

        this.express.post('/login', this.handleLogin);

        this.server.on('upgrade', this.handleUpgrade);
    }

    handleUpgrade(request, socket, head) {
        console.log('Parsing session from request...');
      
        sessionParser(request, {}, () => {
          if (!request.session.userId) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }
      
          console.log('Session is parsed!');
          
          wsManager.handleUpgrade(request, socket, head);
          
        });
    }

    handleLogin(req, res) {
        //
        // "Log in" user and set userId and type to session.
        //
        if (!req.session.userId) {
          if(!req.query.type | !(req.query.type == 'player' | req.query.type == 'observer')) {
            res.send({ result: 'FAILED', message: 'query parameter type is required' });
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