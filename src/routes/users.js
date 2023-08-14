const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { verifyToken } = require('../helpers/auth');
const { User } = require('../models/User');
const { validateUserSchema } = require('../models/User'); // Import the schema instead
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    try {
        // const { error } = validate(req.body);
        const { error } = validateUserSchema.validate(req.body); // Use "validateUserSchema" here
        if (error) return res.status(400).send(error.details[0].message);

        const user = new User(req.body);

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        res.send(user);
    } catch (error) {
        console.log(error);
        res.send('An error occurred');
    }
});


router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Access the authenticated user's ID
        const userId = req.userId;

        // Fetch the user from the database
        const user = await User.findById(userId).select('-password -__v');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'An error occurred while retrieving user' });
    }
});

// Protected route
router.get('/protected', authMiddleware, (req, res) => {
    // The authMiddleware will be called before reaching this handler
    // If the token is valid, req.userId will be available
    const userId = req.userId;
    // Process the request here
    res.send('Protected route');
});


module.exports = router;
