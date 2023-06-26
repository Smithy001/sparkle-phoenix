const WebSocket = require('ws');
var wss;
var players = new Map();
var observers = new Map();

class WSManager {
    constructor() {
        console.log('Initializing WSManager');
        this.setupWSS();
    }

    setupWSS() {
        wss = new WebSocket.Server({ clientTracking: false, noServer: true });
        wss.on('connection', this.handleConnection);
    }

    handleUpgrade(request, socket, head) {
        wss.handleUpgrade(request, socket, head, function (ws) {
            wss.emit('connection', ws, request);
        });
    }

    handleConnection(ws, req) {
        const userId = req.session.userId;
      
        if (req.session.userType == 'player') {
          players.set(userId, ws);
        } else if (req.session.userType == 'observer') {
          observers.set(userId, ws);
        } else {
            console.log("Closing connection");
          ws.close();
        }
      
        ws.on('message', function(message) {
            console.log(`Received message ${message} from user ${userId}`);
            //let jsonMessage = JSON.parse(message);
        });
      
        ws.on('close', function (event) {
          console.log(`Closing connection for user ${userId}`);
          console.log('Reason: ' + event);
          console.log('Reason code: ' + event.code);
          players.delete(userId);
          observers.delete(userId);
        });

        // On Error
        ws.on('error', function(e) {
            console.log("error occured" +e);
        });
    }
}

module.exports = WSManager;