// YOUR CODE HERE:
$(document).ready(function() {

  app.init();

  $('#createNewRoom').on('submit', function(event) {
    event.preventDefault();
    console.log('create button clicked');
    app.addRoom();
  });

  $('body').on('click', '.username', function(event) {
    event.preventDefault();
    app.handleUsernameClick(event);
  });

  $('#messageInput').on('submit', function(event) {
    event.preventDefault();
    app.handleSubmit();
  });

});

var app = {
  server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',

  message: {
    username: window.username,
    text: null,
    roomname: null
  },

  friends: [],
  chatrooms: [],
  chatroom: 'lobby',

  init: function() {
    app.fetch();
    setInterval(function() {
      app.fetch();
    }, 2000);
  },

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      data: {'order': '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        var messages = [];
        data.results.forEach(function(data) {

          var message = {
            createdAt: data.createdAt,
            objectId: data.objectId,
            roomname: data.roomname,
            text: _.escape(data.text),
            username: _.escape(data.username)
          };

          var roomname = _.escape(data.roomname);

          if (app.chatrooms.indexOf(roomname) === -1) {
            app.chatrooms.push(roomname);
            app.renderRoom(roomname);
          }

          messages.push(message);
        });

        $('#chats').children('.message').remove();
        messages.forEach(function(data) {
          if (data.roomname === $('#roomSelect option:selected').text()) {
            app.renderMessage(data);
          }
        });

        console.log('chatterbox: Message received');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessage: function(message) {
    var username = _.escape(message.username);
    var text = _.escape(message.text);
    $('#chats').append('<div class="message"><a href="#" class="username">' + username + '</a>: ' + text + '</div>');
  },

  renderRoom: function(roomName) {
    $('#roomSelect').append('<option>' + roomName + '</option>');
  },

  handleUsernameClick: function(event) {
    var addFriend = $(event.target).text();
    app.friends.push(addFriend);
  },

  handleSubmit: function() {
    app.message.text = $('.text-input').val();
    app.message.username = window.location.search.slice(10);
    app.message.roomname = $('#roomSelect option:selected').text();
    app.send(app.message);
    $('.text-input').val('');
  },

  addRoom: function() {
    var roomName = $('.room-input').val();
    app.chatrooms.push(roomName);
    app.renderRoom(roomName);
    $('.room-input').val('');
  }
};
