const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

// before every action on a user, check if the pw needs hashing
userSchema.pre('save', function(next) {
  let user = this;

  // check if the user is modifying their password
  if (!user.isModified('password')) return next();

  // hash the pw and set it
  bcrypt.hash(user.password, 10)
    .then(hashedPW => {
      user.password = hashedPW;
      next();
    })
    .catch(err => {
      return next(err);
    })
})

// add a method to compare passwords using bcrypt
userSchema.methods.comparePassword = function(candidatePW, next) {
  bcrypt.compare(candidatePW, this.password, function(err, isMatch) {
    if (err) { return next(err); }
    next(null, isMatch);
  })
};

const User = mongoose.model('User', userSchema);
module.exports = User;
