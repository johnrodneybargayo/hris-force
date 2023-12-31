const express = require('express');
const router = express.Router();
const multer = require('multer');
const SignatureModel = require('../models/signature');
const { handleSignatureImageUpload } = require('../middlewares/signatureImageUpload');

// Configure multer storage and limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

// Handle regular signature uploads
router.post('/', upload.single('signature'), async (req, res ) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
      const newSignature = new SignatureModel({
        data: req.file.buffer,
        contentType: req.file.mimetype,
      });

      const savedSignature = await newSignature.save();

      res.status(201).json({
        signatureId: savedSignature._id,
        signatureData: savedSignature.data.toString('base64'),
      });
    } catch (saveError) {
      console.error('Error saving signature:', saveError);
      res.status(500).json({ error: 'An error occurred while saving the signature' });
    }
  } catch (error) {
    console.error('Error processing signature:', error);
    res.status(500).json({ error: 'An error occurred while processing the signature' });
  }
});
// Handle image signature uploads
router.post('/image', upload.single('signatureImage'), handleSignatureImageUpload, async (req, res) => {
  try {
    if (!req.savedSignature) {
      return res.status(400).json({ error: 'No signature image uploaded.' });
    }

    res.status(201).json({
      signatureId: req.savedSignature._id,
      imageUrl: req.savedSignature.imageUrl,
    });
  } catch (error) {
    console.error('Error processing signature image:', error);
    res.status(500).json({ error: 'An error occurred while processing the signature image' });
  }
});

module.exports = router;
