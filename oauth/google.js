const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          username: profile.displayName || profile.id,
          email,
          password: `oauth_google_${profile.id}`,
          role: ['user']
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};
