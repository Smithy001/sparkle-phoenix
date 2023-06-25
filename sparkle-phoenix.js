'use strict';

const HttpServer = require('./src/httpServer');

httpServer = new HttpServer(8080);


const WebSocket = require('ws');


const mapPlayer = new Map();
const mapObserver = new Map();

httpServer.startServer();



/*

app.delete('/logout', function (request, response) {
  const ws = map.get(request.session.userId);

  console.log('Destroying session');
  request.session.destroy(function () {
    if (ws) ws.close();

    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});



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

*/