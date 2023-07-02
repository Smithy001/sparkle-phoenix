$(document).ready(function() {
    $.ajax({
      url: '/lobbies',
      method: 'GET',
      dataType: 'json',
      success: function(lobbies) {
        // Clear the previous content
        $('#lobbyList').clear();
        // Loop through each value in the JSON array
        lobbies.forEach(function(lobbyId) {
          // Append the value to an HTML element
          $('#lobbyList').append('<li>' + value + '</li>');
        });
      },
      error: function() {
        console.log('Error occurred during the AJAX request');
      }
    });
  });