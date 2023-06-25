var moveDir;
var fireDir;

login('player', function(message) {
    console.log(message);
});

$(document).ready(function(){
    $('button').on( "click", function() {
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
    });
});
