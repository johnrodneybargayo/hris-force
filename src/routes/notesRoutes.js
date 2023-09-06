const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { ApplicantModel } = require('../models/Applicant');

// Create a note for an applicant by a specific user
router.post('/:applicantId', async (req, res) => {
  try {
    const { applicantId } = req.params;
    const { userId, text } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the applicant by ID
    const applicant = await ApplicantModel.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    // Create a new note
    const note = {
      text,
      user: userId,
    };

    // Add the note to the applicant's notesSummary array
    applicant.notesSummary.push(note);

    // Save the changes to the applicant
    await applicant.save();

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all notes for a specific applicant
router.get('/:applicantId', async (req, res) => {
  try {
    const { applicantId } = req.params;

    // Find the applicant by ID
    const applicant = await ApplicantModel.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    res.status(200).json(applicant.notesSummary);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
