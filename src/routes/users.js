const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authControllers = require('../controllers/authControllers'); // Import authControllers
const { UserModel } = require('../models/User');

/**
 * Get the current user's profile (protected route)
 * Endpoint: GET /api/users/profile
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { _id, firstName, lastName } = req.user; // Destructure user data from req.user
    console.log(`Fetching user profile for user ID: ${_id}`);

    // Send the user profile data as a JSON response
    res.json({
      userId: _id,
      firstName,
      lastName,
    });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user profile' });
  }
});

/**
 * Get user profile data by user ID (protected route)
 * Endpoint: GET /api/users/:userId
 */
router.get('/:userId', authMiddleware, authControllers.getUserById); // Use the getUserById controller

/**
 * Example of a protected route
 * Endpoint: GET /api/users/protected
 */
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
