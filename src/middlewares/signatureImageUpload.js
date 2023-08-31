const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const Signature = require('../models/signature');
require('dotenv').config(); // To load environment variables

// Configure Google Cloud Storage
const storage = new Storage();
const bucketName = process.env.BUCKET_NAME || 'hrsystem_bucket1'; // Replace with your bucket name

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const handleSignatureImageUpload = async (req, res, next) => {
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
      console.error('Error uploading signature image to GCS:', error);
      res.status(500).json({ error: 'An error occurred while uploading the signature image' });
    });

    stream.on('finish', async () => {
      const imageUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;

      try {
        const newSignature = new Signature({ imageUrl });
        const savedSignature = await newSignature.save();
        req.savedSignature = savedSignature;
        next();
      } catch (saveError) {
        console.error('Error saving signature:', saveError);
        res.status(500).json({ error: 'An error occurred while saving the signature' });
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading signature image:', error);
    res.status(500).json({ error: 'An error occurred while uploading the signature image' });
  }
};

module.exports = {
  upload,
  handleSignatureImageUpload,
};
