const WebSocket = require('ws');
var wss;
var players = new Map();
var observers = new Map();
var functions = new Map();

class WSManager {
    constructor() {
        console.log('Initializing WSManager');
        this.setupWSS();
    }

    addFunction(functionName, functionCallback) {
        functions.set(functionName, functionCallback);
    }

    sendMessage(playerId, message) {
        if (playerId == 'observer') {
            observers.forEach(function(observer) {
                observer.send(JSON.stringify(message));
            });
        }
        else if (Object.keys(players).includes(playerId)) {
            players[playerId].send(JSON.stringify(message));
        }
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

        if (Object.keys(functions).includes("playerJoin")) {
            functions['playerJoin'](userId);
        }
      
        ws.on('message', function(message) {
            console.log(`Received message ${message} from user ${userId}`);
            //let jsonMessage = JSON.parse(message);
            if (message && message.type && Object.keys(functions).includes(message.type)) {
                message.playerId = userId;
                functions[message.type](message);
            }
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