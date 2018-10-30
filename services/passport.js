// Configuration for Passport - Authentication Middleware for Node.js - http://www.passportjs.org/docs/
// Authenticate a user when they attempt to visit a protected route
// Here we make user of passport-jwt library https://github.com/themikenicholson/passport-jwt
// and the passport-local library
// to act as a verification layer in between the user and protected routes?
const passport = require("passPort");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// Strategy 1: Verify user with a JSON Web Token (JWT Strategy)
// Strategy 2: Verify a user with a username and password (Local Strategy)

// Set-up Options for Local Strategy
const localOptions = {
  // Tell Local Strategy where to look on the request object to find the username (if not user)
  usernameField: "email"
};

// Create Local Strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify this username and password. Call done with the user if correct
  // Otherwise call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      // User thinks they have account but they do not
      return done(null, false, { message: "Incorrect username." });
    }
    // Compare password - is `password` equal to user.password?
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch)
        return done(null, false, { message: "Incorrect password." });
      return done(null, user);
    });
  });
});

// Set-up Options for JWT Strategy
const jwtOptions = {
  // Tell JWT Strategy where to look on the request object to find the token
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  // Tell JWT Strategy which secret to use to decode encrypted JWT
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // The decoded payload will contain the user.id and timestamp
  // Done is a callback function

  // See if the user.id in payload exists in database -> call done with user
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect username" });
    }
  });
});

// Instruct Passport Middleware to use this strategy
module.exports = passport.use(jwtLogin);
module.exports = passport.use(localLogin);
