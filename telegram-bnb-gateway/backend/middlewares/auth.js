// middlewares/auth.js
const { verifyToken } = require('../controllers/jwtController'); // Use the jwtController

// Middleware to check JWT token
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  try {
    const decoded = verifyToken(token); // Using verifyToken from jwtController
    req.user = decoded; // Attach the decoded token payload to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = { authenticate };
