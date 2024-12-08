const jwt = require('jsonwebtoken');

// Replace this with your secret key
const JWT_SECRET = 'your_secret_key';  // Keep this secret safe in your .env file

// Payload data (this can be any information you want to store in the token)
const payload = {
  userId: 12345,  // Example user ID
  username: 'testUser',  // Example username
};

// Generate JWT token (no expiration time)
const token = jwt.sign(payload, JWT_SECRET);

console.log('Generated JWT Token:', token);
