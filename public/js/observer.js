var spaceshipImage, bulletImage, explosionImage;
var players = [], gridItems = [];
var boardWidth, boardHeight;
var ready = false;
const borderSize = 2;

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
    if (!update || !update.width || !update.height || !update.players || !update.items) {
        console.log(`Invalid for board update: ${update}`);
        return;
    }
    $('#pregame-info').remove();
    boardWidth = update.width;
    boardHeight = update.height;
    loadPlayers(update.players);
    gridItems = update.items;
    ResizeCanvas();
    addMessages(update.messages);
}

function addMessages(messages) {
    if (!messages) {
        return;
    }
    let messagesElement = $('#messages');

    messages.forEach(function(message){
        messagesElement.prepend(`\n${message}`);
    });
    
    $('.messages-container').show().animate({ scrollTop: 0 }, "fast");
}

function loadPlayers(playerList) {
    players = {};
    playerList.forEach(player => {
        players[player.id] = createPlayerImage(spaceshipImage, player.color);
    });
}

function loadImages() {
    loadImageShip();
}

function loadImageShip() {
    spaceshipImage = new Image();
    spaceshipImage.src = '../img/spaceship.png';
    spaceshipImage.onload = loadImageBullet;
}

function loadImageBullet() {
    bulletImage = new Image();
    bulletImage.src = '../img/bullet.png';
    bulletImage.onload = loadImageExplosion;
}

function loadImageExplosion() {
    explosionImage = new Image();
    explosionImage.src = '../img/explosion.png';
    explosionImage.onload = function () {
        loadImageShrapnel();
    };
}

function loadImageShrapnel() {
    shrapnelImage = new Image();
    shrapnelImage.src = '../img/shrapnel.png';
    shrapnelImage.onload = function () {
        ready = true;
        if (isFragmentPresent('sim')) {
            handleStatusUpdate(getObserverTestData('end-game'));
        }
    };
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
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < boardWidth; row++) {
        for (let col = 0; col < boardHeight; col++) {
            const x = canvas.xOffset + col * canvas.cellSize;
            const y = canvas.yOffset + row * canvas.cellSize;
            drawCell(context, x, y, canvas.cellSize, borderSize);
        }
    }
    drawGridItems(canvas, context, canvas.cellSize, canvas.xOffset, canvas.yOffset, borderSize);
}

function drawGridItems(canvas, context, cellSize, xOffset, yOffset, borderSize) {
    gridItems.forEach(item => {
        let x = xOffset + item.col * cellSize;
        let y = yOffset + item.row * cellSize;

        if (item.id == 'bullet') {
            drawImage(context, bulletImage, x, y, cellSize, item.dir*45, borderSize);
        } else if (item.id == 'explosion') {
            drawImage(context, explosionImage, x, y, cellSize, item.dir*45, borderSize);
        } else if (item.id == 'shrapnel') {
            drawImage(context, shrapnelImage, x, y, cellSize, item.dir*45, borderSize);
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
    canvas.cellSize = Math.min(canvas.width, canvas.height) / boardWidth;
    const gridWidth = canvas.cellSize * boardWidth;
    const gridHeight = canvas.cellSize * boardHeight;
    canvas.xOffset = (canvas.width - gridWidth) * 0.7;
    canvas.yOffset = (canvas.height - gridHeight);

    $('.messages-container').innerWidth(canvas.xOffset);
    $('.messages-container').innerHeight(canvas.height);
}

login('observer', function(message) {
    console.log(message);
    handleStatusUpdate(message);
});
loadImages();

$(document).ready(SetupCanvas);
