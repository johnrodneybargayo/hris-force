const { Storage } = require('@google-cloud/storage');
const path = require('path');
const crypto = require('crypto');
const SignatureImage = require('../models/signature');

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME || 'hrsystem_bucket1';

const handleSignatureUpload = async (req, res, next) => {
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
      console.error('Error uploading signature to GCS:', error);
      res.status(500).json({ error: 'An error occurred while uploading the signature' });
    });

    stream.on('finish', async () => {
      const signatureImageUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;

      try {
        const newSignatureImage = new SignatureImage({ signature: req.file.buffer });
        const savedSignatureImage = await newSignatureImage.save();

        req.savedSignatureImage = savedSignatureImage;
        req.signatureImageUrl = signatureImageUrl; // Pass the image URL to the next middleware
        next();
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

module.exports = handleSignatureUpload;
