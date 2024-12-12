const app = require('./App'); // Import the configured Express app
const socketIo = require('socket.io'); // Import socket.io for real-time communication

// Initialize server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

// Initialize socket.io for real-time communication
const io = socketIo(server);

// Broadcast event when a client connects
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send a welcome message to the client
  socket.emit('welcome', { message: 'Welcome to the real-time service!' });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

module.exports = server;
