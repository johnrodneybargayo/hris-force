const express = require('express');
const router = express.Router();
const UserController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the authMiddleware module

// POST /auth/login
router.post('/login', (req, res) => {
  UserController.login(req.body).then((result) => {
    res.send(result);
  });
});

// Protected route example: requires authentication
router.get('/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});

module.exports = router;
