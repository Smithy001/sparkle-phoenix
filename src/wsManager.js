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

    testMethod() {
        console.log('calling test method');
    }

    handleConnection(ws, req) {
        const userId = req.session.userId;
      
        if (req.session.userType == 'player') {
          players.set(userId, ws);
        } else if (req.session.userType == 'observer') {
          observers.set(userId, ws);
        } else {
          ws.close();
        }
      
        ws.on('message', handleMessage);
      
        ws.on('close', function () {
          console.log(`Closing connection for user ${userId}`);
          players.delete(userId);
          observers.delete(userId);
        });
    }
}

function handleMessage(message) {
    console.log(`Received message ${message} from user ${userId}`);
    //let jsonMessage = JSON.parse(message);
}

module.exports = WSManager;