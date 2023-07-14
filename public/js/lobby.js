$(document).ready(function() {
    updateLobbies();
    setInterval(updateLobbies,15000);

    if (isFragmentPresent('sim')) {
      loadGames(['abc123','edf456','gth654']);
    }

    $('#join-game').click(function(){
      var selectedGame = $('select option:selected').val();
    
      if (selectedGame == undefined) {
        alert('Please select a game to join.');
      } else {
        window.location = `game/${selectedGame}/player`;
      }
    });

    $('#create-game').click(function(){
      $.ajax({
        url: 'game/new',
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          if (data && data.redirect) {
            window.location = redirect;
          }
        },
        error: function() {
          console.log('Error occurred during the AJAX request');
        }
      });
    });
});

function updateLobbies() {
    $.ajax({
        url: 'games',
        method: 'GET',
        dataType: 'json',
        success: loadGames,
        error: function() {
          console.log('Error occurred during the AJAX request');
        }
    });
}

function loadGames(games) {
  let gameList = $('#gameList');
// Clear the previous content
gameList.empty();
// Loop through each value in the JSON array
games.forEach(function(gameId) {
  // Append the value to an HTML element
  
  gameList.append(`<option value="${gameId}">${gameId}</option>`);
});
}