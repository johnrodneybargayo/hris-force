const express = require('express');
const router = express.Router();
const applicantsController = require('../controllers/applicantsController'); // Import the controllers
const ApplicantModel = require('../models/Applicant');

// Route to create a new applicant
router.post('/create', async (req, res) => {
  try {
    const applicantData = req.body; // The data from the request body

    // Add the createdAt property with the current date and time
    applicantData.createdAt = new Date();

    // Create a new instance of the Applicant model with the applicantData
    const newApplicant = new ApplicantModel(applicantData);

    // Save the new applicant to the database
    const savedApplicant = await newApplicant.save();

    res.status(201).json(savedApplicant); // Respond with the saved applicant
  } catch (error) {
    console.error('Error creating applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all applicants
router.get('/list', async (req, res) => {
  try {
    const applicants = await ApplicantModel.find();

    const tilesWithCreatedAt = applicants.map(applicant => ({
      ...applicant.toObject(),
      createdAt: applicant._id.getTimestamp(), // Add the createdAt timestamp
    }));

    res.status(200).json(tilesWithCreatedAt); // Respond with the list of applicants
  } catch (error) {
    console.error('Error getting applicants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/list/:id', async (req, res) => {
  try {
    const applicantId = req.params.id; // Get the applicant ID from the URL parameter
    const applicant = await ApplicantModel.findById(applicantId);

    if (!applicant) {
      // If applicant is not found, return a 404 response
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.status(200).json(applicant); // Respond with the applicant data
  } catch (error) {
    console.error('Error getting applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/update-status/:id', async (req, res) => {
  try {
    const applicantId = req.params.id; // Get the applicant ID from the URL parameter
    const { status } = req.body; // Get the new status from the request body

    const updatedApplicant = await ApplicantModel.findByIdAndUpdate(
      applicantId,
      { status },
      { new: true }
    );

    if (!updatedApplicant) {
      // If applicant is not found, return a 404 response
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.status(200).json(updatedApplicant); // Respond with the updated applicant data
  } catch (error) {
    console.error('Error updating applicant status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Use the controllers for marking applicants as hired or failed
router.post('/hired/:id', applicantsController.markApplicantAsHired);
router.post('/failed/:id', applicantsController.markApplicantAsFailed);

module.exports = router;
