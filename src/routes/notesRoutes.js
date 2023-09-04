const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController'); // Import your notes controller

// Define your routes with callback functions
router.post('/', notesController.createNote); // Use the createNote function as the callback
router.get('/:applicantId', notesController.getNotesByApplicant); // Use the getNotesByApplicant function as the callback

module.exports = router;
