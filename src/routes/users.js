const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// Get user profile (protected route)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).select('-password -__v');
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
