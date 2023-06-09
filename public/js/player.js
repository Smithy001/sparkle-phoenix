var moveDir;
var fireDir;
var gameStarted = false;

function handleStatusUpdate(message) {
    if (!message) {
        console.log("Received an empty message");
        return;
    } else {    
        console.log("Got a message:");
        console.log(message);
    }

    if (message.color) {
        $('#playerColorTitle').text(`the ${message.color}`).css('color', message.color);
    } else {
        console.log('Invalid message');
        return;
    }

    if (!gameStarted) {
        handleStartGame();
    } else {
        $('#turn-end-info').hide();
        $('.game').show();
    }

    if (message.alive == false) {
        handleEndGame();
    } else if (message.winner == true) {
        handleEndGame(true);
    }
}

login('player', handleStatusUpdate);

function handleStartGame() {
    $('#pregame-info').remove();
    $('.game').show();
    gameStarted = true;
}

function handleEndGame(winner) {
    if (winner == true) {
        $('#postgame-info').text('You are victorious!');
    }
    $('#postgame-info').show();
    $('.game').hide();
    gameStarted = false;
}

function handleEndTurn() {
    message = {};
    message.type = 'playerEndTurn';
    message.moveDir = moveDir;
    message.fireDir = fireDir;

    sendMessage(message);
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
        console.log(e);
        handleEndTurn();
        moveDir = null;
        fireDir = null;
        $('#turn-end-info').show();
        $('.game').hide();
        $('#end-turn-button').prop("disabled", true);
        $('.selected').removeClass('selected');
    });

    if (isFragmentPresent('sim')) {
        handleStatusUpdate(getPlayerTestData('dead'));
    }
});