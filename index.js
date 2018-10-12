var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/dist/index.html');
})
app.get('/js', function (req, res) {
  res.sendFile(__dirname + '/dist/app.js');
});
app.get('/css', function (req, res) {
  res.sendFile(__dirname + '/dist/app.css');
});
app.get('/bg', function (req, res) {
  res.sendFile(__dirname + '/dist/background.jpg');
});
app.get('/message.wav', function (req, res) {
  res.sendFile(__dirname + '/dist/message.wav');
});


io.on('connection', function(socket){
    var addedUser = false;

    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('typing', function(usr){
        console.log(usr + 'is typing');
        socket.broadcast.emit('user typing', socket.username);
    });

    socket.on('done typing', function(){
        console.log('user not typing');
        socket.broadcast.emit('user done typing', socket.username);
    });


    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    // when the client emits 'add user', this listens and executes
      socket.on('add user', (username) => {
        console.log('user joined ' + username);
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;

        addedUser = true;

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', socket.username);
  });
});



http.listen(3000, function(){
    console.log('listening on *:3000');
});



