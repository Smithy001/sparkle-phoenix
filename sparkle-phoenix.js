'use strict';

const session = require('express-session');
const express = require('express');
const http = require('http');
const uuid = require('uuid');

const WebSocket = require('ws');

const app = express();
const mapPlayer = new Map();
const mapObserver = new Map();

//
// Serve static files from the 'public' folder.
//
app.use(express.static('public'));

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: 'pdjhdsofndsub7ubnsijuh32u8sabdsjadjk3hk3hadksahkuai3hkuakhsbcbjmxz',
  resave: false
});

app.use(sessionParser);

app.post('/login', function (req, res) {
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
});

app.delete('/logout', function (request, response) {
  const ws = map.get(request.session.userId);

  console.log('Destroying session');
  request.session.destroy(function () {
    if (ws) ws.close();

    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});

//
// Create an HTTP server.
//
const server = http.createServer(app);

//
// Create a WebSocket server completely detached from the HTTP server.
//
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on('upgrade', function (request, socket, head) {
  console.log('Parsing session from request...');

  sessionParser(request, {}, () => {
    if (!request.session.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log('Session is parsed!');

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  });
});

//
// Handle the upgrade to WebSocket connection event
//
wss.on('connection', function (ws, req) {
  const userId = req.session.userId;

  if (req.session.userType == 'player') {
    mapPlayer.set(userId, ws);
  } else if (req.session.userType == 'observer') {
    mapObserver.set(userId, ws);
  } else {
    ws.close();
  }

  ws.on('message', function (message) {
    //
    // Here we can now use session parameters.
    //
    console.log(`Received message ${message} from user ${userId}`);
  
    //let jsonMessage = JSON.parse(message);
  });

  ws.on('close', function () {
    console.log(`Closing connection for user ${userId}`);
    mapPlayer.delete(userId);
    mapObserver.delete(userId);
  });
});

//
// Start the server.
//
server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
  });