var express = require('express'),
    http = require('http'),
    cors = require('cors'),
    io = require('socket.io');

// TODOs
// Detect unread messages
// Save messages and send unread
// Add cookies
// 

// Setup server
var app = express()
    server = http.createServer(app),
    socketIo = io(server);

app.use(cors());
app.set('port', (process.env.PORT || 5000));

// Listen for requests
server.listen(app.get('port'), function () {
  console.log('tincantelephone api listening on', app.get('port'))   
});

// Setup socket.io
socketIo.on('connection', function(socket) {
    var username = socket.handshake.query.username,
        group = socket.handshake.query.group,
        message = socket.handshake.query.message;

    console.log(`\nusername:${username} in group:${group} connected`);
    
    socket.join(group);
    socket.on('client:message', function(data) {
        // Message received from client. 
        console.log(`${data.username} in ${group}: ${data.message}`);

        // Broadcast message to everyone in the group
        socket.to(group).emit('server:message', data);
    });        


    // Log user disconnection
    socket.on('disconnect', function() {
        console.log(`${username} disconnected`);
    });
});

