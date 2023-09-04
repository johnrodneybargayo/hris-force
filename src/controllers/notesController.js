const Applicant = require('../models/Applicant');
const User = require('../models/User');

// Create a new note for an applicant
const createNote = async (req, res) => {
  try {
    const { text, userId, applicantId, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    const newNote = {
      text,
      user: userId,
      timestamp: new Date(),
      status,
    };

    applicant.notes.push(newNote);
    await applicant.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Retrieve notes for a specific applicant
const getNotesByApplicant = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const applicant = await Applicant.findById(applicantId).populate('notes.user');
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    res.json(applicant.notes);
  } catch (error) {
    console.error('Error retrieving notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createNote, getNotesByApplicant };
