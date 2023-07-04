const express = require('express');
const { login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const authRoutes = express.Router();

// Authentication route
authRoutes.post('/login', login);

// Protected route
authRoutes.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

module.exports = authRoutes;
