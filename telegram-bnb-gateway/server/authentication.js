const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required.');
}

const router = express.Router();
const users = []; // Example in-memory user store (replace with DB logic)

/**
 * Middleware to authenticate JWT tokens.
 */
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token provided.'); // Log for missing token
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Log the token and the decoded payload
    console.log('Received Token:', token);
    console.log('Decoded Payload:', verified);

    req.user = verified;
    next();
  } catch (error) {
    console.error('Invalid Token:', error.message); // Log invalid token error
    res.status(403).json({ error: 'Invalid token.' });
  }
}

/**
 * Route to register a new user.
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  console.log('User registered:', username); // Log registration
  res.status(201).json({ message: 'User registered successfully.' });
});

/**
 * Route to log in a user and generate a JWT token.
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = users.find(user => user.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Log the generated token for debugging
  console.log('Generated Token for user', username, ':', token);

  res.json({ message: 'Login successful.', token });
});

module.exports = { router, authenticate };
    