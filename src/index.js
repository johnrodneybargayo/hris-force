const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const users = require("./routes/users");
const inventoryRoutes = require("./routes/inventoryRoutes");
const emailRoutes = require("./routes/emailRoutes");
const applicantRoutes = require("./routes/applicantRoutes");
const uploadImageRoutes = require("./routes/uploadImage");

require("dotenv").config();

const app = express();
const uri = process.env.MONGO_CONNECTION_STRING;
const dbName = process.env.MONGODB_DATABASE;

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
app.use(bodyParser.json());

// Configure CORS
const allowedOrigins = [
  "https://hrsystem-dev.empireonecontactcenter.com",
  // Add more allowed origins as needed
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use("/api/users", users);
app.use("/api/login", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/applicants", applicantRoutes);
app.use("/api/uploadImage", uploadImageRoutes);

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
