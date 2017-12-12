var express = require('express'),
    http = require('http'),
    cors = require('cors'),
    io = require('socket.io');

// Setup server
var app = express()
    server = http.createServer(app),
    socketIo = io(server);

app.use(cors());
app.set('port', (process.env.PORT || 5000));

// Listen for requests
server.listen(app.get('port'), function () {
  console.log('tincantelephone api listening on', app.get('port'))   //check on localhost:3000/api/routexxx
});

// Setup socket.io
socketIo.on('connection', function(socket) {
    var username = socket.handshake.query.username;
    console.log(`${username} connected`);

    socket.on('client:message', function(data) {
        // Message received from client. 
        console.log(`${data.username}: ${data.message}`);

        // Broadcast message to everyone else
        socket.broadcast.emit('server:message', data);
    });
    // Log user disconnection

    socket.on('disconnect', function() {
        console.log(`${username} disconnected`);
    });
});

