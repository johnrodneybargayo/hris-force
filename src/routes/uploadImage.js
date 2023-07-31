const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Image = require('../models/Image'); // Import the Image model
const crypto = require('crypto');

// Create a storage engine for multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    const imageUrl = req.file.filename;

    const newImage = new Image({
      imageUrl: imageUrl,
    });

    const savedImage = await newImage.save();

    req.savedImage = savedImage;
    next();
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
};

router.post('/', upload.single('image'), handleFileUpload, (req, res) => {
  res.status(200).json({ imageUrl: req.savedImage.imageUrl });
});

module.exports = router;