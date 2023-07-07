const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = '431dd5dddcde37181d3816f9e604083693b7fc52873db4a8f2b009d51a23937f';

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
	try {
	  const user = await User.findById(req.userId).select('-password -__v');
	  if (!user) {
		return res.status(404).json({ error: 'User not found' });
	  }
	  res.json(user);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'An error occurred' });
	}
  });
  
  

module.exports = router;
