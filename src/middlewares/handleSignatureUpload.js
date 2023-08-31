const { Storage } = require('@google-cloud/storage');
const path = require('path');
const crypto = require('crypto');
const SignatureImage = require('../models/signature');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME;

const rateLimit = require('express-rate-limit');

const signatureUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});

const handleSignatureUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const gcsFileName = `${crypto.randomBytes(16).toString('hex')}${path.extname(req.file.originalname)}`;
    const blob = storage.bucket(bucketName).file(gcsFileName);

    const stream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (error) => {
      console.error('Error uploading signature to GCS:', error);
      res.status(500).json({ error: 'An error occurred while uploading the signature' });
    });

    stream.on('finish', async () => {
      const signatureImageUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;

      try {
        const newSignatureImage = new SignatureImage({ signature: req.file.buffer });
        const savedSignatureImage = await newSignatureImage.save();

        res.status(201).json({
          message: 'Signature image uploaded successfully',
          signatureImageUrl: signatureImageUrl,
          savedSignatureImage: savedSignatureImage,
        });
      } catch (saveError) {
        console.error('Error saving signature image:', saveError);
        res.status(500).json({ error: 'An error occurred while saving the signature image' });
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading signature:', error);
    res.status(500).json({ error: 'An error occurred while uploading the signature' });
  }
};

module.exports = {
  handleSignatureUpload,
  signatureUploadLimiter, // Export the rate limiting middleware
};
