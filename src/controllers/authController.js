const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const secretKey = '431dd5dddcde37181d3816f9e604083693b7fc52873db4a8f2b009d51a23937f'; // Replace with your actual secret key

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).header('WWW-Authenticate', 'Bearer').json({ error: 'Invalid email or password' });
    }

    // Check if the password matches
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).header('WWW-Authenticate', 'Bearer').json({ error: 'Invalid email or password' });
    }

    // Create a JWT token for the user with a 1-hour expiration time
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    // Return the token and success message to the client as JSON
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};


const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user from the database based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data to the client as JSON
    res.json({ user });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user' });
  }
};

module.exports = {
  login,
  getUser,
};
