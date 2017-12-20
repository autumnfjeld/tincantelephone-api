var express = require('express'),
    http = require('http'),
    cors = require('cors'),
    io = require('socket.io');

// TODOs
// Detect unread messages
// Save messages and send unread
// Add cookies

// Quick & dirty message store
var messageStore = {test: 'hi'};

// Setup server
var app = express()
    server = http.createServer(app),
    socketIo = io(server);

app.use(cors());
app.set('port', (process.env.PORT || 5000));

// Listen for requests
server.listen(app.get('port'), function () {
  console.log('tincantelephone api listening on', app.get('port'));
});

// Setup socket.io
socketIo.on('connection', function(socket) {
    var username = socket.handshake.query.username,
        group = socket.handshake.query.group,
        message = socket.handshake.query.message;

    console.log('test', messageStore.test);
    messageStore[group] = [];

    
    console.log(`\nusername:${username} in ${group} connected`);
    
    socket.join(group);
    socket.on('client:message', function(data) {
        // Message received from client. 
        console.log(`${data.username} in ${data.group} at ${data.timeStamp}: ${data.message}`);
        // console.log('data', data);
        messageStore[data.group].push(data);
        console.log(group, ' messageStore count', messageStore[group].length);

        // Broadcast message to everyone in the group
        socket.to(group).emit('server:message', data);
    });        

    // Log user disconnection
    socket.on('disconnect', function() {
        console.log(`${username} disconnected`);
    });
});

