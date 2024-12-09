const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const jwt = require('jsonwebtoken');

// OAuth 2.0 Strategy configuration
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: 'https://authorization-server.com/oauth/authorize', // Replace with the auth server URL
      tokenURL: 'https://authorization-server.com/oauth/token', // Replace with the token endpoint URL
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        accessToken,
        refreshToken,
        profile,
      };
      done(null, user);
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
