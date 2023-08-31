const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/User');
const { validateLoginSchema } = require('../models/User'); // Import the schema for login validation
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Use environment variables for sensitive information
const secretKey = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
  try {
    const { error } = validateLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '1h' }); // Include token expiration
    user.token = token; // Store the token in the user object
    await user.save(); // Save the user with the updated token

    res.json({ token }); // Return the token in the response
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

module.exports = router;
