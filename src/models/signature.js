  const mongoose = require('mongoose');
  const { Schema } = mongoose;

  const signatureSchema = new Schema({
    data: Buffer,
    contentType: String,
  });

  const SignatureModel = mongoose.model('Signature', signatureSchema);

  module.exports = SignatureModel;
