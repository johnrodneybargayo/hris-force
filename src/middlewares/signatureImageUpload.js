const express = require('express');
const router = express.Router();
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const crypto = require('crypto');
const Signature = require('../models/signature');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME;

const multer = require('multer');
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// Regular expression for valid image content types
const validContentTypeRegex = /^image\/(jpeg|png|gif)$/;

const sanitizeContentType = (contentType) => {
  // Validate content type using regular expression
  if (!validContentTypeRegex.test(contentType)) {
    // Invalid content type, return a default or handle the error
    return 'application/octet-stream'; // Default content type
  }

  // If content type is valid, return the sanitized value
  return contentType;
};

const handleSignatureImageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // Validate and sanitize the content type
    const sanitizedContentType = sanitizeContentType(req.file.mimetype);

    const gcsFileName = `${crypto.randomBytes(16).toString('hex')}${path.extname(req.file.originalname)}`;
    const blob = storage.bucket(bucketName).file(gcsFileName);

    const stream = blob.createWriteStream({
      metadata: {
        contentType: sanitizedContentType,
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
