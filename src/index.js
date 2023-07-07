const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import the router module
const users = require('./routes/users'); // Import the router module

require('dotenv').config();

const app = express();
const uri = process.env.MONGO_CONNECTION_STRING;
const dbName = process.env.MONGODB_DATABASE;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

// Use the router module
app.use(express.json());
app.use("/api/users", users);
app.use("/api/login", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
module.exports.handler = serverless(app);
