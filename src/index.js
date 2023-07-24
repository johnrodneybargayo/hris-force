const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const users = require('./routes/users');
const inventoryRoutes = require('./routes/inventoryRoutes'); // Import the router module for inventory

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
app.use("/api/inventory", inventoryRoutes); // Add the route for inventory

// ... Other code

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
module.exports.handler = serverless(app);
