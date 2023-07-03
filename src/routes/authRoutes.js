const express = require('express');
const router = express.Router();
const { validateLoginData } = require('../middlewares/authMiddleware');
const { login } = require('../controllers/authController');

// Sign-in route
router.get('/sign-in', validateLoginData, login);

module.exports = router;
