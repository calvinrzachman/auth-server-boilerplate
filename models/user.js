// Local Definition of a User for Mongoose/MongoDB
const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Tell mongoose about the fields of model

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true }, // Enforce uniqueness on email
  password: String
});

// On save hook, encrypt password
// Before saving a model, run this function
userSchema.pre("save", function(next) {
  // get access to the user model
  const user = this;

  // generate a salt, then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // hash our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      // overwrite plaintext password with
      user.password = hash;
      next();
    });
  });
});

// Add a method to compare a stored password (encrypted) with a password supplied by user @ login
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    return callback(null, isMatch);
  });
  // this.password is the hashed and salted password
};

// Create the model class
const ModelClass = mongoose.model("user", userSchema);

// Export the model
module.exports = ModelClass;
