// userController.js
const UserModel = require('../models/User');

// Function to fetch a user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toObject());
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user' });
  }
};

// Function to update user details
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body; // Include updated user details in the request body

    // Perform user update operation here

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating user' });
  }
};


