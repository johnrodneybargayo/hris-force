const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * Get the current user's profile (protected route)
 * Endpoint: GET /api/users/profile
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // User ID is available in req.user (from authentication middleware)
    const userId = req.user._id;
    console.log(`Fetching user profile for user ID: ${userId}`);

    // You already have the user data in req.user, so no need to query the database again
    const user = req.user;

    const profileData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      // Add other fields as needed
    };

    console.log('User profile retrieved successfully');
    res.json(profileData);
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user profile' });
  }
});

/**
 * Get user profile data by user ID (protected route)
 * Endpoint: GET /api/users/:userId
 */
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching user profile data for user ID: ${userId}`);

    // Query the "users" collection to find the user by ID
    const user = await UserModel.findById(userId).select('-password -__v');

    if (!user) {
      console.log('User not found');
      // If the user is not found, return a 404 response with an error message
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract the desired user fields into profileData
    const profileData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      // Add other fields as needed
    };

    console.log('User profile data retrieved successfully');

    // Send the profileData as a JSON response
    res.json(profileData);
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    res.status(500).json({ error: 'An error occurred while fetching user profile data' });
  }
});

/**
 * Example of a protected route
 * Endpoint: GET /api/users/protected
 */
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
