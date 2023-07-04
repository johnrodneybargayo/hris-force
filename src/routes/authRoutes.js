const express = require('express');
const { login } = require('../controllers/authController'); // Update the path to the correct controller file
const authMiddleware = require('../middlewares/authMiddleware'); // Update the path to the correct middleware file

const authRoutes = express.Router();

// Authentication route
authRoutes.post('/sign-in', login);

// Protected route
authRoutes.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

module.exports = authRoutes;
