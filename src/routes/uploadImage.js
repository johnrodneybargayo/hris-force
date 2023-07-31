const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Create a storage engine for multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/uploadImage
router.post('/', upload.single('image'), (req, res) => {
  // The uploaded image will be available as req.file
  // You can handle the file upload logic here
  try {
    const imageUrl = req.file.filename; // Assuming you want to save the filename to the database

    // Do any additional processing or validation here

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
});

module.exports = router;
