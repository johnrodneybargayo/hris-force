const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,

  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant',

  },
  status: {
    type: String,

    enum: ['Failed', 'Endorsed for Final Interview', 'For Exam Retake', 'Endorsed for Director/CEO Interview', 'For Reserved', 'Passed'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const NoteModel = mongoose.model('Note', noteSchema);

module.exports = NoteModel;
