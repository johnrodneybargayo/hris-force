const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { generateAuthToken } = require('../helpers/tokenUtils');

const secretKey = process.env.JWT_SECRET_KEY;
const tokenExpiration = process.env.JWT_TOKEN_EXPIRATION || '1h';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return unauthorized(res);
    }

    const token = generateAuthToken(user._id); // Use the generateAuthToken function
    user.token = token; // Store the token in the user object
    await user.save(); // Save the user with the updated token

    console.log('User logged in successfully');
    res.json({ token }); // Return the token in the response
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by their ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return notFound(res);
    }

    res.json({ user });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user' });
  }
};

function unauthorized(res) {
  return res
    .status(401)
    .header('WWW-Authenticate', 'Bearer')
    .json({ error: 'Invalid email or password' });
}

function notFound(res) {
  return res.status(404).json({ error: 'User not found' });
}

module.exports = {
  login,
  getUser,
};
