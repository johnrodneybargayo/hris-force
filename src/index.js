const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const router = express.Router();

// MongoDB connection URI and options
const mongoURI = 'mongodb+srv://johnrodneybargayo:N3tBKgZkwzF1wEhR@hrsystem.alub4ez.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection URI
const dbName = 'hrsystem'; // Replace with your MongoDB database name
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(mongoURI, { ...mongoOptions, dbName })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS
app.use('/.netlify/functions/index', router); // Map the router to the specific path

// Routes
router.use('/auth', authRoutes);

// Sign-in controller
router.post('/auth/sign-in', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    if (await user.comparePassword(password)) {
      // Generate JWT token
      const secretKey = 'your-secret-key';
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

      // Sign-in successful
      return res.status(200).json({ message: 'Sign-in successful', token });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Default route
router.get("/", (req, res) => {
  res.send('Welcome to the HR System API');
});

// Export the app wrapped with serverless-http
module.exports.handler = serverless(app);

// Start the server
const PORT = process.env.PORT || 3000; // Use the provided port or 4000 as default
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
