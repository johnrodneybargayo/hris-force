const express = require('express');
const serverless = require('serverless-http');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const uri = 'mongodb+srv://empireone:hXCieVuIw5DvCX7z@serverlessinstance0.i4tpgor.mongodb.net/?retryWrites=true&w=majority'; // Use the environment variable MONGODB_URI
const dbName = 'hrsystem_serverless'; // Replace with your MongoDB database name
const secretKey = '8956022d3c89a8f6df26bb32daa07127b8c605db3d00c52c5babe80eccbd33ec'; // Replace with your own secret key for JWT

app.use(cors());
app.use(bodyParser.json());

// Connect to the MongoDB database
let db;

async function connectToDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB');
  db = client.db(dbName);
}

// Login route
app.post('/sign-in', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });

    if (user) {
      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (isPasswordMatched) {
        const accessToken = jwt.sign({ userId: user._id }, secretKey);
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

// Define and use authRoutes
const authRoutes = express.Router();

authRoutes.get('/', (req, res) => {
  // Implement your authentication logic here
  res.send('Custom authentication logic');
});

app.use('/auth', authRoutes);

// Start the server
connectToDatabase().then(() => {
  if (require.main === module) {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
