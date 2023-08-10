const express = require('express');
const router = express.Router();
const ApplicantModel = require('../models/Applicant');

// Route to create a new applicant
router.post('/create', async (req, res) => {
  try {
    const applicantData = req.body; // The data from the request body

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

    res.status(200).json(applicants); // Respond with the list of applicants
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


module.exports = router;
