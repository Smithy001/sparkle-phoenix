var spaceshipImage;
var bulletImage;
var player1Image;
var player2Image;
var player3Image;
var player4Image;

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

function loadImages() {
    spaceshipImage = new Image();
    spaceshipImage.src = '../img/spaceship.png';
    spaceshipImage.onload = function(){
        player1Image = createPlayerImage(spaceshipImage, "red");
        player2Image = createPlayerImage(spaceshipImage, "blue");
        player3Image = createPlayerImage(spaceshipImage, "green");
        player4Image = createPlayerImage(spaceshipImage, "brown");
        ready = true;
    }
    bulletImage = new Image();
    bulletImage.src = '../img/bullet.png';
}

function createPlayerImage(image, color) {
    let playerImage = imageToCanvas(image)
    colorImage(playerImage, color, spaceshipImage);
    return playerImage;
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

function animate(canvas, context) {
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (ready) {
        let fillColor = '#000';
        let renderSize = 20;
        context.fillStyle = fillColor;
        context.fillRect(
            2, 
            2, 
            renderSize,
            renderSize);

       
        drawImage(context, bulletImage, 250, 200, 43, 45);

        drawImage(context, player1Image, 200, 200, 43, 45);
        drawImage(context, player2Image, 300, 200, 43, 135);
        drawImage(context, player3Image, 200, 300, 43, 225);
        drawImage(context, player4Image, 300, 300, 43, 315);
    }
    requestAnimationFrame(function() {
        animate(canvas, context);
    });
}

function drawImage(context, image, x, y, size, degrees) {
    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    context.save();

    // move to the center of the canvas
    context.translate(x,y);

    // rotate the canvas to the specified degrees
    context.rotate(degrees*Math.PI/180);
    
    // draw the image
    // since the context is rotated, the image will be rotated also
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
