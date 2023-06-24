var spaceshipImage;
var bulletImage;
var players, gridItems;
var boardWidth, boardHeight;
var ready = false;

function SetupCanvas() {
    canvas = document.getElementById('world');
  
    if (canvas && canvas.getContext) {
        context = canvas.getContext('2d');
        console.log('Initialized canvas');
    } else {
        console.log('Failed to initialized canvas');
        return;
    }

    window.addEventListener('resize', ResizeCanvas, true);
    ResizeCanvas();

    animate(canvas, context);
}

function handleStatusUpdate(update) {
    boardWidth = update.width;
    boardHeight = update.height;
    loadPlayers(update.players);
    gridItems = update.items;
}

function loadPlayers(playerList) {
    players = {};
    playerList.forEach(player => {
        players[player.id] = createPlayerImage(spaceshipImage, player.color);
    });
}

function loadImages() {
    spaceshipImage = new Image();
    spaceshipImage.src = '../img/spaceship.png';
    spaceshipImage.onload = function(){
        bulletImage = new Image();
        bulletImage.src = '../img/bullet.png';
        bulletImage.onload = function(){
            handleStatusUpdate(JSON.parse(testStatusUpdate));
            ready = true;
        }
    }
}

function animate(canvas, context) {
    if (ready) {
        drawGrid(canvas, context)
    }
    requestAnimationFrame(function() {
        animate(canvas, context);
    });
}

function drawGrid(canvas, context) {
    const borderSize = 2;
    const cellSize = Math.min(canvas.width, canvas.height) / boardWidth;
    const gridWidth = cellSize * boardWidth;
    const gridHeight = cellSize * boardHeight;
    const xOffset = (canvas.width - gridWidth) / 2;
    const yOffset = (canvas.height - gridHeight) / 2;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < boardWidth; row++) {
        for (let col = 0; col < boardHeight; col++) {
            const x = xOffset + col * cellSize;
            const y = yOffset + row * cellSize;
            drawCell(context, x, y, cellSize, borderSize);
        }
    }
    drawGridItems(canvas, context, cellSize, xOffset, yOffset, borderSize);
}

function drawGridItems(canvas, context, cellSize, xOffset, yOffset, borderSize) {
    gridItems.forEach(item => {
        let x = xOffset + item.col * cellSize;
        let y = yOffset + item.row * cellSize;

        if (item.id == 'bullet') {
            drawImage(context, bulletImage, x, y, cellSize, item.dir*45, borderSize);
        } else {
            if (players[item.id]) {
                drawImage(context, players[item.id], x, y, cellSize, item.dir*45, borderSize);
            }
        }
    });
}

function drawCell(context, x, y, cellSize, borderSize) {
    context.fillStyle = "black";
    context.fillRect(
        x, 
        y, 
        cellSize,
        cellSize);
    
    context.fillStyle = "white";
    context.fillRect(
        x + borderSize, 
        y + borderSize, 
        cellSize - borderSize*2,
        cellSize - borderSize*2);
}

function drawImage(context, image, x, y, size, degrees, borderSize) {
    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    context.save();

    // move to the center of the canvas
    context.translate(x+size/2+borderSize, y+size/2+borderSize);

    // rotate the canvas to the specified degrees
    context.rotate(degrees*Math.PI/180);
    
    // draw the image
    // since the context is rotated, the image will be rotated also
    size = size*0.8;
    context.drawImage(image,-size/2,-size/2, size, size);
    //context.drawImage(player1Image, 0, 0, 50, 50);

    // we’re done with the rotating so restore the unrotated context
    context.restore();
}

function ResizeCanvas() { 
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
}

login('observer', function(message) {
    console.log(message);
});
loadImages();

$(document).ready(SetupCanvas);
