const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const Image = require('../models/Image'); // Import the Image model
const crypto = require('crypto');

// Create a storage engine for multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const gcsFileName = `${req.file.fieldname}-${crypto.randomBytes(16).toString('hex')}${path.extname(req.file.originalname)}`;

    // Upload the image to Google Cloud Storage
    const storage = new Storage();
    const bucketName = 'hrsystem_bucket1'; // Replace with your bucket name
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(gcsFileName);

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

      const newImage = new Image({
        imageUrl: imageUrl,
      });

      const savedImage = await newImage.save();

      req.savedImage = savedImage;
      next();
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
};

router.post('/', upload.single('image'), handleFileUpload, (req, res) => {
  res.status(200).json({ imageUrl: req.savedImage.imageUrl });
});

module.exports = router;
