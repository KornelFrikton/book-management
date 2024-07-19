const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [4, 'Username must be at least 4 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']    
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minlength: [4, 'Password must be at least 4 characters long']
  }
});

//Token generator for authorization
UserSchema.methods.generateAuthToken = function() {
  const user = this;    
  const token = jwt.sign({_id:user._id.toString()}, 'secret', {
      expiresIn: '1h'
  });
  return token;
}

module.exports = mongoose.model("User", UserSchema);