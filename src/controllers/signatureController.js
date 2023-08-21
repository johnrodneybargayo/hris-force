const ApplicantModel = require('../models/Applicant'); // Assuming your Applicant model is defined in this file

exports.uploadSignature = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save the image URL to the applicant document
    const applicantId = req.body.applicantId; // Assuming you pass the applicantId in the request body
    const applicant = await ApplicantModel.findByIdAndUpdate(
      applicantId,
      { signatureUrl: file.buffer.toString('base64') },
      { new: true }
    );

    return res.status(200).json(applicant);
  } catch (error) {
    console.error('Error uploading signature:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
