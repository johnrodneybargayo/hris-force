const Note = require('../models/notes');

exports.addNote = async (req, res) => {
  const { text, user, timestamp, status } = req.body;
  
  try {
    const newNote = await Note.create({ text, user, timestamp, status });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note.' });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
};
