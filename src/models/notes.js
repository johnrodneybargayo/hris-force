const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: String,
  user: String,
  timestamp: String,
  status: String
});

module.exports = mongoose.model('Note', noteSchema);
