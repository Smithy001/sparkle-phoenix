$(document).ready(function() {
    updateLobbies();
    setInterval(updateLobbies,15000);
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