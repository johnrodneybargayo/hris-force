const express = require('express');
const router = express.Router();
const path = require('path'); // Import the 'path' module for file handling
const fs = require('fs'); // Import the 'fs' module for fisle operations
const signatureMiddleware = require('../middlewares/signatureImageUpload'); // Import the middleware
const applicantsController = require('../controllers/applicantsController'); // Import the controllers
const SignatureModel = require('../models/signature'); // Make sure the path to the Signature model is correct
const ApplicantModel = require('../models/Applicant'); // Import the Applicant model
const notesController = require('../controllers/notesController');
const { Storage } = require('@google-cloud/storage'); // Import the Storage module
require('dotenv').config({ path: path.join(__dirname, '.env') });
const sanitizeHtml = require('sanitize-html');

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME;

router.post('/create', async (req, res) => {
  try {
    console.log('Received POST request to create applicant.');

    const { signatureData, ...applicantData } = req.body;
    const imageBuffer = Buffer.from(signatureData, 'base64');

    const imageName = `${Date.now()}.png`;
    console.log(`Saving image as ${imageName}`);
    const file = storage.bucket(bucketName).file(imageName);
    await file.save(imageBuffer, { contentType: 'image/png' });

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${imageName}`;

    const signature = new SignatureModel({
      data: imageBuffer,
      contentType: 'image/png',
    });
    console.log('Saving signature data to the database.');
    await signature.save();

    console.log('Creating applicant in the database.');
    const applicant = await ApplicantModel.create({
      ...applicantData,
      signature: signature._id,
    });

    console.log('Applicant created successfully.');
    res.status(201).json(applicant);
  } catch (error) {
    console.error('Error creating applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/list', async (req, res) => {
  try {
    const applicants = await ApplicantModel.find();

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
    const applicant = await ApplicantModel.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    // Simulate fetching signature data
    const signatureData = {
      signatureBase64: 'your_signature_base64_data',
    };

    // Sanitize the signature data before including it in the response
    const sanitizedSignature = sanitizeHtml(signatureData.signatureBase64);

    const applicantWithSignature = {
      ...applicant.toObject(),
      signatureData: sanitizedSignature,
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

    // Ensure the signatureData has binary data and contentType property
    if (signatureData.data && signatureData.contentType) {
      const imageBuffer = Buffer.from(signatureData.data, 'base64');

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

    const updatedApplicant = await ApplicantModel.findByIdAndUpdate(
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
router.get('/failed-applicants', async (req, res) => {
  try {
    const failedApplicants = await ApplicantModel.find({ status: 'Failed' });

    const applicantsWithSignature = await Promise.all(
      failedApplicants.map(async (applicant) => {
        let signature = null;

        if (applicant.signature) {
          signature = await SignatureModel.findById(applicant.signature);
        }

        return {
          ...applicant.toObject(),
          signature: signature ? signature._id : null,
        };
      })
    );

    res.status(200).json(applicantsWithSignature);
  } catch (error) {
    console.error('Error getting failed applicants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/pool/:id', async (req, res) => {
  try {
    const applicantId = req.params.id;
    await ApplicantModel.findByIdAndUpdate(applicantId, { status: StatusEnum.Pooled });
    res.status(200).json({ message: 'Applicant pooled successfully' });
  } catch (error) {
    console.error('Error pooling applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to move an applicant to shortlisting with status "interview"
router.put('/move-to-shortlisting/:id', async (req, res) => {
  try {
    const applicantId = req.params.id;
    await ApplicantModel.findByIdAndUpdate(applicantId, { status: StatusEnum.Shortlisted });
    res.status(200).json({ message: 'Applicant moved to shortlisting with status "interview"' });
  } catch (error) {
    console.error('Error moving applicant to shortlisting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new note for an applicant
router.post('/:applicantId/notes', async (req, res) => {
  const { content, status } = req.body;
  const applicantId = req.params.applicantId;

  try {
    if (!content || !status) {
      return res.status(400).json({ error: 'Content and status are required fields' });
    }

    const note = await notesController.createNoteForApplicant(applicantId, content, status);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'An error occurred while creating the note' });
  }
});

// Get all notes for an applicant
router.get('/:applicantId/notes', async (req, res) => {
  const applicantId = req.params.applicantId;

  try {
    const notes = await notesController.getAllNotesForApplicant(applicantId);
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'An error occurred while fetching notes' });
  }
});
module.exports = router;
