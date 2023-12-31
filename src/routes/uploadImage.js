const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const crypto = require('crypto');
const Image = require('../models/Image'); // Import the Image model
const rateLimit = require('express-rate-limit'); // Import express-rate-limit

// Configure Google Cloud Storage
const storage = new Storage();
const bucketName = process.env.BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// Create a storage engine for multer to handle file uploads
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
router.use(limiter); // Apply the limiter to all routes in this router

// Sanitize a filename to prevent path traversal
function sanitizeFilename(filename) {
  return path.basename(filename); // Using path.basename to get only the base filename
}

const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const originalFilename = sanitizeFilename(req.file.originalname);
    const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}${path.extname(originalFilename)}`;
    const gcsFileName = `uploads/${uniqueFilename}`; // Use a specific directory and unique filename
    const blob = bucket.file(gcsFileName);

    // Upload the file to Google Cloud Storage
    await blob.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;

    const newImage = new Image({ imageUrl });
    const savedImage = await newImage.save();
    req.savedImage = savedImage;
    next();
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
};

router.post('/', upload.single('image'), handleFileUpload, (req, res) => {
  res.status(201).json({ imageUrl: req.savedImage.imageUrl });
});

module.exports = router;
