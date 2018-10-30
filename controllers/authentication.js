// Authentication Controller
const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

// Take a user's ID and encode it with our secret
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
  // JSON Web Tokens have a `sub` and `iat` (issued at time) property by convention
}

// Issue Tokens
// Define Sign-in function - called by Express route handler on POST requests to "/signin"
exports.signin = function(req, res, next) {
  // User has already had their email and password authenticated
  // They just need a token

  // We need access to user - thanks to Passport it is available on req.user
  res.send({ token: tokenForUser(req.user) });
};

// Define Sign-up function - called by Express route handler on POST requests to "/signup"
exports.signup = function(req, res, next) {
  // Verify uniqueness of email
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);

  if (!password || !email) {
    return res
      .status(422)
      .send({ error: "You must provide email and password" });
  }
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    // If user exists return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email already in use" });
    }

    // If user is unique, create and save user record
    const newUser = new User({
      email: email,
      password: password
    });

    newUser.save(function(err) {
      if (err) {
        return next(err);
      }
    });

    // Respond indicating creation of user - including token for future requests
    // JSON Web Token
    res.json({ token: tokenForUser(newUser) });
  });
};
