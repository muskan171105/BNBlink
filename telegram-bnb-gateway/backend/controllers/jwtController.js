const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your_secret_key'; // Use environment variables for security

// Generate JWT Token
const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, secretKey, { expiresIn });
};

// Verify JWT Token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
};

// Refresh Token
const refreshToken = (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, secretKey); // Verify old token
        const newToken = generateToken({ id: decoded.id, email: decoded.email }); // Generate new token
        res.json({ token: newToken });
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};

// Check if Token is Expired
const isTokenExpired = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return false; // Not expired
    } catch (err) {
        if (err.name === 'TokenExpiredError') return true; // Expired
        throw err; // Other errors (e.g., invalid token)
    }
};

// Export all functions
module.exports = {
    generateToken,
    verifyToken,
    refreshToken,
    isTokenExpired,
};
