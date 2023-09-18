const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { createAccessToken } = require('../helpers/tokenUtils');
const authenticateUser = require('../middlewares/authMiddleware');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;
const tokenExpiration = process.env.JWT_TOKEN_EXPIRATION || '1h';

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

router.post('/', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid email or password');
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (user.isAuthenticated) {
      console.log('User is already authenticated');
    } else {
      const tokenPayload = {
        _id: user._id,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const token = createAccessToken(tokenPayload);

      user.token = token;
      user.isAuthenticated = true;

      await user.save();
    }

    console.log('User logged in successfully');
    res.json({ token: user.token, firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

router.post('/logout', authenticateUser, async (req, res) => {
  try {
    const user = req.authUser;

    // Update the user's isAuthenticated status to false
    user.isAuthenticated = false;

    // Clear any tokens, cookies, or sessions associated with the user (if applicable)
    // Example: req.session.destroy();

    await user.save(); // Save the updated user in the database

    console.log('Logout successful');

    // Respond with a success message
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error occurred during logout:', error);

    if (error.name === 'ValidationError') {
      // Handle validation errors (if any)
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'An error occurred during logout' });
  }
});

module.exports = router;
