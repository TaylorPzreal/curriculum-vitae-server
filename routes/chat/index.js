// ============ Socket.io =========//
const io = require('socket.io')(httpServer);

// app.use('/chat', (req, res, next) => {

io.on('connection', (socket) => {
  console.warn('一位新用户上线了');
  socket.on('disconnect', () => {
    console.warn('一个用户断开了连接');
  });

  // 监听到有新消息时，发送给所有连接的客户端
  socket.on('chat', (msg) => {
    io.emit('chat', msg);
  });

  // 只向新上线用户发送消息
  socket.emit('chat', {
    name: 'Admin',
    logo: null,
    msg: 'Welcome to chat.'
  });
});
// });
// ========== Sockit.io ==========//
