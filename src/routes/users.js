const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { validateUserSchema } = require('../models/User');
const { createAccessToken } = require('../helpers/tokenUtils'); // Import the token creation function
const authMiddleware = require('../middlewares/authMiddleware');
const { generateAuthToken } = require('../helpers/auth'); // Assuming you have a function to generate tokens
const { User } = require('../models/User');


// User registration
router.post('/register', async (req, res) => {
  try {
    const { error } = validateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User(req.body);
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = createAccessToken(user); // Generate token for the registered user

    res.json({ user: user.toObject(), token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
});

// Get user profile (protected route)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-password -__v');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toObject());
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user' });
  }
});

// Protected route example
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
