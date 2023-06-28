
let ws;

function showMessage(message) {
    console.log(message);
}

function login(playerType, callback) {
    fetch('/login?type=' + playerType, { method: 'POST', credentials: 'same-origin' })
      .then(connect.bind(null, callback))
      .catch(function (err) {
        showMessage(err.message);
      });
}

function connect(callback) {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`wss://${location.host}`);
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
        console.log("Received message:")
        console.log(event)
        console.log("Calling callback")
        callback(JSON.parse(event.data));
    }
    callback({message:"ready"});
}

function createPlayerImage(image, color) {
    let playerImage = imageToCanvas(image)
    colorImage(playerImage, color, spaceshipImage);
    return playerImage;
}

function sendMessage(message) {
  ws.send(JSON.stringify(message));
}

function imageToCanvas(image){
    const c = document.createElement("canvas");
    c.width = image.width;
    c.height = image.height;
    c.ctx = c.getContext("2d"); // attach context to the canvas for eaasy reference
    c.ctx.drawImage(image,0,0);
    return c;
}

function colorImage(image,color, maskImage) {
    // Fill image with color
    image.ctx.fillStyle = color;
    image.ctx.fillRect(0,0,image.width,image.height);

    // Apply mask
    image.ctx.globalCompositeOperation = "destination-in";
    image.ctx.drawImage(maskImage,0,0);
    image.ctx.globalCompositeOperation = "source-over";
    return image;
}

window.onbeforeunload = function (e) {
  ws.close();
};

var testStatusUpdate = `
{
    "width": 20,
    "height": 20,
    "players": [
{"id": "abcd1", "color": "red"},
{"id": "ef431", "color": "blue"},
{"id": "123ef", "color": "green"},
{"id": "adcb9", "color": "brown"}
],
"items": [
{"id": "abcd1", "col": 1, "row": 1, "dir": 4},
{"id": "ef431", "col": 1, "row": 3, "dir": 0},
{"id": "123ef", "col": 3, "row": 3, "dir": 3},
{"id": "adcb9", "col": 5, "row": 3, "dir": 7},
{"id": "bullet", "col": 8, "row": 5, "dir": 7},
{"id": "bullet", "col": 12, "row": 15, "dir": 5},
{"id": "bullet", "col": 15, "row": 5, "dir": 2},
{"id": "explosion", "col": 9, "row": 15, "dir": 6}
]
}
`;