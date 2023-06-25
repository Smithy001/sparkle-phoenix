'use strict';

const HttpServer = require('./src/httpServer');
const WSManager = require('./src/wsManager');

var wsManager = new WSManager();

var httpServer = new HttpServer(8080, wsManager);

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
*/