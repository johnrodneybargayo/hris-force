const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const path = require('path');
const { createAccessToken } = require('../helpers/tokenUtils'); // Import the createAccessToken function
const authenticateUser = require('../middlewares/authMiddleware'); // Import the authentication middleware
require('dotenv').config();

// Use environment variables for sensitive information
const secretKey = process.env.JWT_SECRET_KEY;
const tokenExpiration = process.env.JWT_TOKEN_EXPIRATION || '1h'; // Token expiration time, default to 1 hour

// Request validation using express-validator
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

router.post('/', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid email or password');
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token for the user using the createAccessToken function
    const token = createAccessToken(user._id, user.isAdmin);

    // Store the token in the user object and save it
    user.token = token;
    await user.save();

    console.log('User logged in successfully');
    res.json({ token }); // Return the token in the response
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

router.post('/logout', async (req, res) => {
  try {
    // Assuming you're sending the token in the request headers
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Verify the token synchronously
    const decoded = jwt.verify(token, secretKey);

    // Blacklist the token (optional step)
    // You can implement a token blacklist to prevent the token from being used again

    // Perform any other necessary cleanup or logging

    // Return a success message
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error occurred during logout:', error);
    res.status(500).json({ error: 'An error occurred during logout' });
  }
});
module.exports = router;
