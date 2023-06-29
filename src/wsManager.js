const WebSocket = require('ws');
var wss;
var players = new Map();
var observers = new Map();
var functions = new Map();
var lastObserverMessage;

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
            lastObserverMessage = JSON.stringify(message);
            observers.forEach(function(observer) {
                observer.send(lastObserverMessage);
            });
        }
        else if (players.has(playerId)) {
            players.get(playerId).send(JSON.stringify(message));
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
            if (functions.has("playerJoin")) {
                console.log('Calling player join');
                functions.get('playerJoin')(userId);
            }
        } else if (req.session.userType == 'observer') {
            if (functions.has("ObserverJoin")) {
                console.log('Calling ObserverJoin');
                functions.get('ObserverJoin')(userId);
            }
            observers.set(userId, ws);
            if (lastObserverMessage) {
                ws.send(lastObserverMessage);
            }
        } else {
            console.log("Closing connection");
            ws.close();
        }
      
        ws.on('message', function(message) {
            console.log(`Received message ${message} from user ${userId}`);

            let jsonMessage = JSON.parse(message);
            console.log(functions);
            console.log(jsonMessage);
            console.log(functions.has(jsonMessage.type));
            if (jsonMessage && jsonMessage.type && functions.has(jsonMessage.type)) {
                console.log('Calling callback');
                jsonMessage.playerId = userId;
                functions.get(jsonMessage.type)(jsonMessage);
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