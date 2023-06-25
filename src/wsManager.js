const WebSocket = require('ws');

class WSManager {
    constructor() {
        this.players = new Map();
        this.observers = new Map();
    }

    setupWSS() {
        this.wss = new WebSocket.Server({ clientTracking: false, noServer: true });
        this.wss.on('connection', this.handleConnection);
    }

    handleUpgrade(request, socket, head) {
        this.wss.handleUpgrade(request, socket, head, function (ws) {
            wss.emit('connection', ws, request);
        });
    }

    handleConnection(ws, req) {
        const userId = req.session.userId;
      
        if (req.session.userType == 'player') {
          this.players.set(userId, ws);
        } else if (req.session.userType == 'observer') {
          this.observers.set(userId, ws);
        } else {
          ws.close();
        }
      
        ws.on('message', this.handleMessage);
      
        ws.on('close', function () {
          console.log(`Closing connection for user ${userId}`);
          this.players.delete(userId);
          this.observers.delete(userId);
        });
    }

    handleMessage(message) {
        console.log(`Received message ${message} from user ${userId}`);
        //let jsonMessage = JSON.parse(message);
    }
}

module.exports = WSManager;