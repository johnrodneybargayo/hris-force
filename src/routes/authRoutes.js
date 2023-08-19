const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/User');
const { validateUserSchema } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Use environment variables for sensitive information
const secretKey = process.env.JWT_SECRET_KEY || '431dd5dddcde37181d3816f9e604083693b7fc52873db4a8f2b009d51a23937f';

router.post('/', async (req, res) => {
  try {
    const { error } = validateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '1h' }); // Include token expiration
    user.token = token;
    await user.save();

    res.json({ token });
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

module.exports = router;
