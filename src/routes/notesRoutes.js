const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Create a new note for an applicant
router.post('/:applicantId', async (req, res) => {
  try {
    const { text, user, status } = req.body;
    const applicantId = req.params.applicantId;

    // Create a new note
    const newNote = new Note({
      text,
      user,
      status,
      applicantId,
    });

    // Save the note to the database
    const savedNote = await newNote.save();

    res.json(savedNote);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'An error occurred while adding the note.' });
  }
});

// Get notes for a specific applicant
router.get('/:applicantId', async (req, res) => {
  try {
    const applicantId = req.params.applicantId;
    
    // Retrieve all notes for the specified applicant
    const notes = await Note.find({ applicantId });

    res.json(notes);
  } catch (error) {
    console.error('Error getting notes:', error);
    res.status(500).json({ error: 'An error occurred while fetching notes.' });
  }
});

module.exports = router;
