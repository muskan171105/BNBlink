const jwt = require('jsonwebtoken');

// Generate a JWT Token
function generateToken(payload, expiresIn = '1h') {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error('Error generating token:', error.message);
    throw new Error('Failed to generate token');
  }
}

// Verify a JWT Token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Invalid token:', error.message);
    throw new Error('Invalid token');
  }
}

module.exports = { generateToken, verifyToken };
