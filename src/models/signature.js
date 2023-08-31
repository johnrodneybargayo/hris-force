const mongoose = require('mongoose');
const { Schema } = mongoose;

const signatureSchema = new Schema({
  data: Buffer, // For the original data (if needed)
  contentType: String, // For the original content type (if needed)
  signatureImageUrl: String, // For storing the Google Cloud Storage URL
  uploadedAt: { type: Date, default: Date.now },
});

const SignatureModel = mongoose.model('Signature', signatureSchema);

module.exports = SignatureModel;
