const express = require('express');
const router = express.Router();
const path = require('path'); // Import the 'path' module for file handling
const fs = require('fs'); // Import the 'fs' module for file operations
const signatureMiddleware = require('../middlewares/signatureMiddleware'); // Import the middleware
const applicantsController = require('../controllers/applicantsController'); // Import the controllers
const SignatureModel = require('../models/signature'); // Make sure the path to the Signature model is correct
const Applicant = require('../models/Applicant'); // Import the Applicant model
const { Storage } = require('@google-cloud/storage'); // Import the Storage module

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME || 'hrsystem_bucket1'; // Replace with your bucket name

router.post('/create', async (req, res) => {
  try {
    const { signatureData, ...applicantData } = req.body;
    const imageBuffer = Buffer.from(signatureData, 'base64');

    const imageName = `${Date.now()}.png`;
    const file = storage.bucket(bucketName).file(imageName);
    await file.save(imageBuffer, { contentType: 'image/png' });

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${imageName}`;

    const signature = new SignatureModel({
      data: imageBuffer,
      contentType: 'image/png',
    });
    await signature.save();

    const applicant = await Applicant.create({
      ...applicantData,
      signature: signature._id,
    });

    res.status(201).json(applicant);
  } catch (error) {
    console.error('Error creating applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const applicants = await Applicant.find();

    const applicantsWithCreatedAt = applicants.map(applicant => ({
      ...applicant.toObject(),
      createdAt: applicant._id.getTimestamp(),
      signature: applicant.signature, // Include the signature field
    }));

    res.status(200).json(applicantsWithCreatedAt);
  } catch (error) {
    console.error('Error getting applicants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/list/:id', async (req, res) => {
  try {
    const applicantId = req.params.id;
    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    // Simulate fetching signature data
    const signatureData = {
      signatureBase64: 'your_signature_base64_data',
    };

    const applicantWithSignature = {
      ...applicant.toObject(),
      signatureData: signatureData.signatureBase64,
    };

    res.status(200).json(applicantWithSignature);
  } catch (error) {
    console.error('Error getting applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/signature/:id', async (req, res) => {
  try {
    const signatureId = req.params.id;
    console.log('Requested Signature ID:', signatureId);

    // Fetch the associated signature data based on the signature's ID
    const signatureData = await SignatureModel.findById(signatureId);
    console.log('Retrieved Signature Data:', signatureData);

    if (!signatureData) {
      return res.status(404).json({ error: 'Signature data not found' });
    }

    // Add error handling and validation here
    if (signatureData.data && signatureData.contentType === 'image/png') {
      const imageBuffer = Buffer.from(signatureData.data.buffer, 'base64');

      // Set appropriate content type in the response
      res.set('Content-Type', signatureData.contentType);

      // Send the binary image data as the response
      res.status(200).send(imageBuffer);
    } else {
      res.status(404).json({ error: 'Signature data not found or invalid' });
    }
  } catch (error) {
    console.error('Error getting signature data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.put('/update-status/:id', async (req, res) => {
  try {
    const applicantId = req.params.id;
    const { status } = req.body;

    const updatedApplicant = await Applicant.findByIdAndUpdate(
      applicantId,
      { status },
      { new: true }
    );

    if (!updatedApplicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.status(200).json(updatedApplicant);
  } catch (error) {
    console.error('Error updating applicant status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Use the controllers for marking applicants as hired or failed
router.post('/hired/:id', applicantsController.markApplicantAsHired);
router.post('/failed/:id', applicantsController.markApplicantAsFailed);

module.exports = router;
