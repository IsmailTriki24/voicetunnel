const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', socket => {
  console.log(`🟢 Client connected: ${socket.id}`);

  socket.on('join', () => {
    socket.broadcast.emit('new-user', socket.id);
  });

  socket.on('signal', ({ to, from, data }) => {
    io.to(to).emit('signal', { from, data });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', socket.id);
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('🚀 Server listening on http://localhost:3000');
});