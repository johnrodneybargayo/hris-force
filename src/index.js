const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

// MongoDB connection URI and options
const mongoURI = 'mongodb+srv://hris-eo:7b1kysZMkSpoOKDS@cluster0.ymkqxds.mongodb.net/hrsystem?retryWrites=true&w=majority'; // Replace with your MongoDB connection URI
const dbName = 'hrsystem'; // Replace with your MongoDB database name
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(mongoURI, mongoOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the route that interacts with the MongoDB database
router.get("/", async (req, res) => {
  try {
    // Define a Mongoose model
    const ExampleModel = mongoose.model('Example', new mongoose.Schema({
      name: String,
      age: Number
    }));

    // Query the database using the Mongoose model
    const result = await ExampleModel.find();

    res.json(result);
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use("/.netlify/functions/index", router);

// Export the app wrapped with serverless-http
module.exports.handler = serverless(app);


// Start the server
const PORT = process.env.PORT || 3000; // Use the provided port or 3000 as default
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
