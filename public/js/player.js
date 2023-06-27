var moveDir;
var fireDir;
var gameStarted = false;

function handleMessage(message) {
    if (!message) {
        console.log("Received an empty message");
    } 

    if (!gameStarted) {
        handleStartGame();
    } else {
        $('#turn-end-info').hide();
        $('.game').show();
    }

    if (message.color) {
        $('#playerColorTitle').text(`the ${message.color}`).css('color', message.color);
    }
    console.log("Got a message: " + message);
}

login('player', handleMessage);

function handleStartGame() {
    $('#pregame-info').remove();
    $('.game').show();
    gameStarted = true;
}

function handleEndTurn() {
    // Send end turn
}

$(document).ready(function(){
    $('.button-container button').on( "click", function() {
        if (!$(this).hasClass('no-select')) {
            if ($(this).hasClass('bullet')) {
                $('.bullet').removeClass('selected');
                fireDir = $(this).data('direction');
            } else if ($(this).hasClass('spaceship')) {
                $('.spaceship').removeClass('selected');
                moveDir = $(this).data('direction');
            }
            $(this).addClass('selected');
        }

        if (fireDir != null && moveDir != null) {
            $('#end-turn-button').prop("disabled", false);
        }
    });

    $('#end-turn-button').on('click', function(e){
        moveDir = null;
        fireDir = null;
        console.log(e);
        $('#turn-end-info').show();
        $('.game').hide();
        $('#end-turn-button').prop("disabled", true);
        $('.selected').removeClass('selected');
    });
});