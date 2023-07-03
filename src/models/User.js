const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  age: Number,
  password: String
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
