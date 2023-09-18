const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { generateAuthToken } = require('../helpers/tokenUtils');

const secretKey = process.env.JWT_SECRET_KEY;
const tokenExpiration = process.env.JWT_TOKEN_EXPIRATION || '1h';

// Function to handle user login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists and the password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return unauthorized(res);
    }

    // Generate a new JWT token
    const token = generateAuthToken(user._id);

    // Update the user's token field in the database
    user.token = token;
    await user.save();

    console.log('User logged in successfully');
    res.json({ token });
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

const logout = async (req, res) => {
  try {
    // Clear the user's token field in the database (assuming user is authenticated)
    req.user.token = null; // You should have the authenticated user in the request object

    // Save the updated user in the database
    await req.user.save();

    console.log('User logged out successfully');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error occurred during logout:', error);
    res.status(500).json({ error: 'An error occurred during logout' });
  }
};

const getUserById = async (req, res) => {
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
  getUserById,
};
