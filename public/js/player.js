login('player');

$(document).ready(function(){
    $('button').on( "click", function() {
        if (!$(this).hasClass('no-select')) {
            $('button').removeClass('selected');
            $(this).addClass('selected');
        }
    });
});
