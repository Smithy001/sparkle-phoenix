
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

    let wsProtocol = 'ws';
    // Connect securely if on https
    if (window.location.protocol == "https:") {
        wsProtocol = 'wss';
     }

    ws = new WebSocket(`${wsProtocol}://${location.host}`);
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

    setInterval(function(){
      ws.send(JSON.stringify({message: "heartbeat"}));
    }, 15000);
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

function isFragmentPresent(fragmentName) {
    // Get the URL fragment
    var fragment = window.location.hash;

    // Remove the '#' at the beginning of the fragment
    if (fragment.startsWith('#')) {
        fragment = fragment.slice(1);
    }

    // Check if the URL fragment matches the given fragment name
    return fragment === fragmentName;
}

window.onbeforeunload = function (e) {
  ws.close();
};

function getObserverTestData(scenario) {
  let testData = JSON.parse(testObserverUpdate);

  switch (scenario) {
    case 'end-game': 
      // Set all but one player as not alive
      testData.players[0].alive = true;
      for (let i = 1; i<testData.players.length; i++) {
        testData.players[i].alive = false;
      }
      break;
  }
  return testData;
}

function getPlayerTestData(scenario) {
  let testData = JSON.parse(testPlayerUpdate);

  switch (scenario) {
    case 'dead':
      testData.alive = false;
    
    case 'winner':
      testData.winner = true;
  }

  return testData
}

var testObserverUpdate = `
{
    "width": 20,
    "height": 20,
    "players": [
{"id": "abcd1", "color": "red", "alive": true},
{"id": "ef431", "color": "blue", "alive": true},
{"id": "123ef", "color": "green", "alive": true},
{"id": "adcb9", "color": "brown", "alive": true}
],
"items": [
{"id": "abcd1", "col": 1, "row": 1, "dir": 4},
{"id": "ef431", "col": 1, "row": 3, "dir": 0},
{"id": "123ef", "col": 3, "row": 3, "dir": 3},
{"id": "adcb9", "col": 5, "row": 3, "dir": 7},
{"id": "bullet", "col": 8, "row": 5, "dir": 7},
{"id": "bullet", "col": 12, "row": 15, "dir": 5},
{"id": "bullet", "col": 15, "row": 5, "dir": 2},
{"id": "shrapnel", "col": 10, "row": 12, "dir": 4},
{"id": "explosion", "col": 9, "row": 15, "dir": 6}
],
"messages":[
  "Game started",
  "Explosion at 3, 5",
  "Red player eliminated"
]
}
`;

var testPlayerUpdate = `
{ "alive":true, "color":"red" }
`;