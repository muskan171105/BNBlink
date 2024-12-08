const { verifyToken } = require('../controllers/jwtController'); // Use the jwtController

// Middleware to check JWT token
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

  try {
    const decoded = verifyToken(token); // Using verifyToken from jwtController
    req.user = decoded; // Attach the decoded token payload to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('JWT Error:', error.message); // Log the error
    const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;
    return res.status(statusCode).json({ error: error.message || 'Invalid or expired token.' });
  }
}

module.exports = { authenticate };
