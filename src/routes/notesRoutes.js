const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/:applicantId', authMiddleware, async (req, res) => {
  const { content, status } = req.body;
  const applicantId = req.params.applicantId;
  const createdByUserId = req.user._id; // Use the ID of the logged-in user

  try {
    if (!content || !status) {
      return res.status(400).json({ error: 'Content and status are required fields' });
    }

    // Call the controller method to create a note for the applicant
    const note = await notesController.createNoteForApplicantWithUserId(
      applicantId,
      content,
      status,
      createdByUserId
    ); // Pass createdByUserId

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note for applicant:', error);
    res.status(500).json({ error: 'An error occurred while creating the note for the applicant' });
  }
});

// Get all notes for a user
// Modify your server route to fetch notes from all users
router.get('/applicantId', async (req, res) => {
  try {
    const notes = await notesController.getAllNotes(); // Implement this function to get notes from all users
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'An error occurred while fetching notes' });
  }
});



// Get a specific note by ID
router.get('/:noteId', async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const note = await notesController.getNoteById(noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the note' });
  }
});

// Update a specific note by ID
router.put('/:noteId', async (req, res) => {
  const noteId = req.params.noteId;
  const { content, status } = req.body;

  try {
    const updatedNote = await notesController.updateNoteById(noteId, content, status);
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note by ID:', error);
    res.status(500).json({ error: 'An error occurred while updating the note' });
  }
});

// Delete a specific note by ID
router.delete('/:noteId', async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const result = await notesController.deleteNoteById(noteId);
    if (!result) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note by ID:', error);
    res.status(500).json({ error: 'An error occurred while deleting the note' });
  }
});

// Create a new note for an applicant
router.post('/:applicantId', authMiddleware, async (req, res) => {
  const { content, status } = req.body;
  const applicantId = req.params.applicantId;

  try {
    if (!content || !status) {
      return res.status(400).json({ error: 'Content and status are required fields' });
    }

    // Call the controller method to create a note for the applicant
    const note = await notesController.createNoteForApplicant(applicantId, content, status);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'An error occurred while creating the note' });
  }
});

module.exports = router;
