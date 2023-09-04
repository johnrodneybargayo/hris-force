const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: String, required: true },
    timestamp: { type: String, required: true },
    status: { type: String, required: true },
});

module.exports = mongoose.model('Note', noteSchema);
