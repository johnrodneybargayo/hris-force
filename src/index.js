const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');

require('dotenv').config(); // Load environment variables from .env file

const app = express();
const uri = process.env.MONGO_CONNECTION_STRING; // Use the environment variable MONGO_CONNECTION_STRING
const dbName = process.env.MONGODB_DATABASE; // Use the environment variable MONGODB_DATABASE
const secretKey = process.env.SECRET_KEY; // Use the environment variable SECRET_KEY

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

app.use(bodyParser.json());

// CORS configuration
app.use(cors());

app.options('*', cors()); // Enable preflight requests for all routes

app.post('/register', async (req, res) => {
  try {
    // User registration code
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/sign-in', async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = mongoose.model('User'); // Assuming you have a User model defined

    const user = await User.findOne({ email });

    if (user) {
      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (isPasswordMatched) {
        const accessToken = jwt.sign({ userId: user._id }, secretKey);
        res.set('Access-Control-Allow-Origin', 'https://hrsystem-dev.empireonecontactcenter.com');
        res.json({ success: true, accessToken });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if userId is a valid ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use('/auth', authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
module.exports.handler = serverless(app);
