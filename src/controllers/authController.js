const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Function to generate JWT token
const generateToken = (userId) => {
  const secretKey = 'fbbd1ad9b4ce47abbb4c20103b1760f151bce76263db70f5303127a80fe5fa71'; // Replace with your secret key
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
  return token;
};

// Sign-in controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare entered password with hashed password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Sign-in successful
    res.status(200).json({ message: 'Sign-in successful', token });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
