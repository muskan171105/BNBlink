const express = require('express');
const passport = require('./controllers/auth');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Redirect user to the authorization server
router.get('/login', passport.authenticate('oauth2'));

// Handle OAuth callback
router.get(
  '/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return token to the client
    res.json({ token });
  }
);

module.exports = router;
