const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');
// create a passport  for github user acount authentication
module.exports = function (passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_REDIRECT_URI
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value ||
            `${profile.username}@github-oauth.local`;;

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              username: profile.username || profile.id,
              email,
              role: ['user'],
              password: `oauth_github_${profile.id}`
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
