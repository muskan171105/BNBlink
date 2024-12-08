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
const refreshToken = async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, secretKey);

        // Optional: Validate user against database
        // const isValidUser = await validateUser(decoded.id, decoded.email);
        // if (!isValidUser) {
        //     return res.status(403).json({ error: 'User no longer exists or is inactive.' });
        // }

        const newToken = generateToken({ id: decoded.id, email: decoded.email });
        res.json({ token: newToken });
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};

// Check if Token is Expired
const isTokenExpired = (token) => {
    try {
        jwt.verify(token, secretKey);
        return false; // Token is valid and not expired
    } catch (err) {
        return err.name === 'TokenExpiredError'; // True if expired
    }
};

// Export all functions
module.exports = {
    generateToken,
    verifyToken,
    refreshToken,
    isTokenExpired,
};
