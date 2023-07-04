const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const secretKey = '21008e3b8a0584f7c8951c3c4b4b19539207cda777861c42e32d839aeb1363b8';

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await db.collection('users').findOne({ email });

    // Check if user exists and password matches
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
