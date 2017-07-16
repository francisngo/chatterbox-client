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
  chatRooms: [],
  chatRoom: 'lobby',

  /*
  ajax gets the messages
  messages are in object format

  message = {
    username: 'blah blah',
    text: 'blah blah',
    room: 'lobby'
  }

  // ajax get method = grabs data in JSON format X
  // test = to display any message object data X
  // once test is a success then we can apply the data into html format X
  // display the messages somewhere in the DOM, specfically the body X

  // setInterval on app.fetch() to every x seconds X
  // in our html page, create a chat container to display new messages X
  // create a for-loop to only display/render 10 or so messages at a time after fetch /
  // sort the order of the incoming data to retreive newest messages X

  // create a click handler to listen to clicks on username X
  // if username is clicked, add username to friends list X
  // create a form input X
  // create a submit button to send messages from input X
  // when sending message object => requires the user's name from prompt, message in form input, the room they submitted the message
  // create different rooms

  */

  init: function() {
    // console.log('init function');
    app.fetch();
    setInterval(function() {
      app.fetch();
    }, 2000);
  },

  send: function(message) {
    // console.log('send function');
    //use ajax to post messages
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
    // console.log('fetch function');
    //use ajax to post message
    // console.log('fetching...');
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

          if (app.chatRooms.indexOf(roomname) === -1) {
            app.chatRooms.push(roomname);
            app.renderRoom(roomname);
          }

          messages.push(message);
        });

        $('#chats').children('.message').remove();
        messages.forEach(function(data) {
          // console.log(data.roomname);
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
    // console.log('room rendered');
    $('#roomSelect').append('<option>' + roomName + '</option>');
  },

  /*
  <option selected="selected">
    lobby
  </option>
  */

  handleUsernameClick: function(event) {
    // console.log('added friend');
    var addFriend = $(event.target).text();
    app.friends.push(addFriend);
  },

  handleSubmit: function() {
    console.log('submit button was clicked');
    //grab text from text-input
    app.message.text = $('.text-input').val();
    //grab user name from searchbar, slice off ?username
    app.message.username = window.location.search.slice(10);
    app.message.roomname = $('#roomSelect option:selected').text();
    app.send(app.message);
    $('.text-input').val('');
  },

  addRoom: function() {
    // console.log('room added');
    var newRoomName = $('.room-input').val();
    app.chatRooms.push(newRoomName);
    app.renderRoom(newRoomName);
    $('.room-input').val('');
  }
};
