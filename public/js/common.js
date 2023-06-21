
let ws;

function showMessage(message) {
    alert(message);
}

function login(playerType) {
    fetch('/login?type=' + playerType, { method: 'POST', credentials: 'same-origin' })
      .then(connect)
      .then(showMessage)
      .catch(function (err) {
        showMessage(err.message);
      });
}

function connect() {
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
}