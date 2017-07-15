// YOUR CODE HERE:
var app = {
  server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',

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
  // in our html page, create a chat container to display new messages
  // create a for-loop to only display/render 10 or so messages at a time after fetch
  // sort the order of the incoming data to retreive newest messages

  // create a click handler to listen to clicks on username
  // if username is clicked, display that username's messages only
  // create a form input
  // create a submit button to send messages from input
  // when sending message object => requires the user's name from prompt, message in form input, the room they submitted the message
  // create different rooms

  */

  init: function() {
    console.log('init function');
    app.send({username: 'francis', text: 'this is a random test', roomname: 'lobby'});

    setInterval(function() {
      app.fetch();
    }, 1000);
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
    console.log('fetching...');
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('name : ', data.results[5].username);
        console.log('roomname : ', data.results[5].roomname);
        console.log('text : ', data.results[5].text);
        console.log('chatterbox: Message received');
        $('body').append('<p>' + data.results[5].username + '</p>');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  }
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function() {
  $('#chats').append('<p>Test</p>');
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append('<div id="' + roomName + '"></div>');
};

app.handleUserNameClick = function() {
  $('.username').on('click', function() { console.log('Added a friend'); });
};
