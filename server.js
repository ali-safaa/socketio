let express = require('express');
let app = express();
let port = 3000;
let path = require('path');
let http = require('http');
let server = http.createServer(app);
let socketio = require('socket.io');
let io = socketio(server);
let formatMessage = require('./utils/messages');
let {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

// get all files from folder public
app.use(express.static('public'));
let botName = 'chatCord bot';

//run when client connects
io.on('connection', (socket) => {
  // joinRoom from client
  socket.on('joinRoom', ({ username, room }) => {
    let user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // welcome current user
    socket.emit('message', formatMessage(botName, 'welcome to chat cord'));

    // broadcast when a user is connect
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined a chat`)
      );

    // Send users and rooms info when connect
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // listen for chatMessage event from client
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // runs when client disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and rooms info when disconnect
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
server.listen(port, () => console.log('server running on port 3000'));
