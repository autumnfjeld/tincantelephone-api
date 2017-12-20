var express = require('express'),
    http = require('http'),
    cors = require('cors'),
    io = require('socket.io'),
    moment = require('moment');

// TODOs
// Refactor in ES6
// Read up on structing a node app
// Detect unread messages
// Save messages and send unread
// Add cookies

// Quick & dirty message store
var messageStore = {test: 'hi'},
    newId;

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
        message = socket.handshake.query.message,
        newMessage = {
            username: 'God',
            message: username + ' joined the ' + group + 'group',
            unixTimeStamp: moment().unix()
        },
        welcomeMessage = {
            username: 'God',
            message: 'Hello. Tell me everything.',
            unixTimeStamp: moment().unix()
        },        
        timeStamp;
    // console.log('socket', socket);

    messageStore[group] = messageStore[group] || [];
    console.log(group, ' messageStore count', messageStore[group].length);
    console.log(`\nNew connection: username:${username} id:${socket.id}`);

    // Join the group
    socket.join(group, function() {
        console.log(`Joined ${group}: username:${username}`);
        // Send past messages to client
        socketIo.to(socket.id).emit('server:pastMessages', messageStore[group]);
        socketIo.to(socket.id).emit('server:message',welcomeMessage);
    });

    // Announce new person, send to everyone except new person
    socket.to(group).emit('server:message', newMessage);

    // Listen for message received from client. 
    socket.on('client:message', function(data) {
        timeStamp = moment.unix(data.unixTimeStamp).format();
        console.log(`${data.username} in ${data.group} at ${timeStamp}: ${data.message}`);
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

