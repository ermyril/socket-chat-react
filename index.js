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
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});



