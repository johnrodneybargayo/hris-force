const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: 'Applicant', // Reference the User model
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Failed', 'Endorsed for Final Interview', 'For Exam Retake', 'Endorsed for Director/CEO Interview', 'For Reserved', 'Passed'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const NoteModel = mongoose.model('Note', noteSchema);

module.exports = NoteModel;
