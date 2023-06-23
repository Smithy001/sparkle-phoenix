
let ws;

function showMessage(message) {
    console.log(message);
}

function login(playerType, callback) {
    fetch('/login?type=' + playerType, { method: 'POST', credentials: 'same-origin' })
      .then(connect.bind(callback))
      .catch(function (err) {
        showMessage(err.message);
      });
}

function connect(callback) {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://${location.host}`);
    ws.onerror = function () {
      showMessage('WebSocket error');
    };
    ws.onopen = function () {
      showMessage('WebSocket connection established');
    };
    ws.onclose = function () {
      showMessage('WebSocket connection closed');
      ws = null;
    };
    ws.onmessage = function(event) {
        callback(event);
    }
    callback("ready");
}