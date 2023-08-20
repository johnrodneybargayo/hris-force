const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const crypto = require('crypto');
const Image = require('../models/Image'); // Import the Image model
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configure Google Cloud Storage
const storage = new Storage();
const bucketName = process.env.BUCKET_NAME || 'hrsystem_bucket1'; // Replace with your bucket name

// Create a storage engine for multer to handle file uploads
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const gcsFileName = `${crypto.randomBytes(16).toString('hex')}${path.extname(req.file.originalname)}`;
    const blob = storage.bucket(bucketName).file(gcsFileName);

    const stream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (error) => {
      console.error('Error uploading image to GCS:', error);
      res.status(500).json({ error: 'An error occurred while uploading the image' });
    });

    stream.on('finish', async () => {
      const imageUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;

      try {
        const newImage = new Image({ imageUrl });
        const savedImage = await newImage.save();
        req.savedImage = savedImage;
        next();
      } catch (saveError) {
        console.error('Error saving image:', saveError);
        res.status(500).json({ error: 'An error occurred while saving the image' });
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
};

router.post('/', upload.single('image'), handleFileUpload, (req, res) => {
  res.status(201).json({ imageUrl: req.savedImage.imageUrl });
});

module.exports = router;
