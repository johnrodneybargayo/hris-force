const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    
    // Get the public image URL after the image is uploaded
    const imageUrl = `https://empireone-global-inc.uc.r.appspot.com/uploads/${req.file.filename}`;

    // Return the public image URL in the API response
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
});

module.exports = router;
