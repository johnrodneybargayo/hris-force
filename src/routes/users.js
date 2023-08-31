const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUserSchema } = require('../models/User'); // Import the schema instead
const bcrypt = require('bcrypt');
const { generateAuthToken } = require('../helpers/auth'); // Assuming you have a function to generate tokens
const { User } = require('../models/User');

router.post('/', async (req, res) => {
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

    const token = generateAuthToken(user._id); // Generate token for the registered user

    res.json({ user: user.toObject(), token }); // Send user object and token in response
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering user' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-password -__v');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toObject()); // Convert to plain object before sending
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user' });
  }
});

router.get('/protected', authMiddleware, (req, res) => {
  const userId = req.userId;
  res.json('Protected route');
});

module.exports = router;
