const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamp: Date,
  status: String,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = {
  Note,
};
