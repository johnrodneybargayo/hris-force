const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { UserModel } = require('../models/User');
const { createAccessToken } = require('../helpers/tokenUtils');

// User registration route with input validation
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    // Add more validation rules for other fields as needed
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if the email is already registered
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user with the hashed password and other fields
      const user = new UserModel({
        email,
        password: hashedPassword,
        // Add other fields here
      });

      // Save the user to the database
      await user.save();

      // Generate a token for the registered user
      const token = createAccessToken(user);

      res.json({ user: user.toObject(), token });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'An error occurred while registering user' });
    }
  }
);

module.exports = router;
