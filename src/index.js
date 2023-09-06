const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet"); // Import Helmet
const authRoutes = require("./routes/authRoutes");
const users = require("./routes/users");
const inventoryRoutes = require("./routes/inventoryRoutes");
const emailRoutes = require("./routes/emailRoutes"); // Import the email routes
const applicantRoutes = require("./routes/applicantRoutes"); // Import the applicant routes
const uploadImageRoutes = require("./routes/uploadImage"); // Import the uploadImage routes
const signatureRoutes = require("./routes/signatureRoute"); // Import the SignatureImage Routes
const countRoutes = require('./routes/countRoutes'); // Import the countRoutes Routes
const notesRoutes = require('./routes/notesRoutes'); // Make sure the path is correct

const path = require("path");

require("dotenv").config();

const app = express();
const uri = process.env.MONGO_CONNECTION_STRING;
const dbName = process.env.MONGODB_DATABASE;
const googleApplicationCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: dbName,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

// Middleware
app.use(helmet()); // Use Helmet for security
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

// Serve static files from the 'uploads' directory
//app.use('/uploads', express.static('uploads'));
// Assuming 'express' is imported and your app is defined as 'app'

// Routes
app.use("/api/users", users);
app.use("/api/login", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/emails", emailRoutes); // Add the email routes
app.use("/api/applicants", applicantRoutes); // Add the applicant routes
app.use("/api/uploadImage", uploadImageRoutes); // Add the uploadImage routes
app.use("/api/signature", signatureRoutes);
app.use("/api/signature/image", signatureRoutes);
app.use('/api/statusCounts', countRoutes);
app.use('/api/notes', notesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(500).json({ error: "An unexpected error occurred" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
module.exports.handler = serverless(app);
