const Applicant = require('../models/Applicant'); // Import the Applicant model

const signatureMiddleware = async (req, res, next) => {
  try {
    const { signatureData, firstName, lastName } = req.body; // Extract firstName and lastName from the request body

    // Check if there is a signature
    if (!signatureData) {
      return res.status(400).json({ error: 'Signature data is required' });
    }

    // Convert signatureData to a Buffer
    const signatureBuffer = Buffer.from(signatureData, 'base64');

    // Create an applicant with signature
    const applicant = new Applicant({
      firstName: firstName,
      lastName: lastName,
      // ... other applicant fields ...
      signature: signatureBuffer,
    });

    // Save the applicant document
    const savedApplicant = await applicant.save();

    req.applicantId = savedApplicant._id;

    next();
  } catch (error) {
    console.error('Error processing applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = signatureMiddleware;
