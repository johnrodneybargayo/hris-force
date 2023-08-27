const Applicant = require('../models/Applicant');
const SignatureImageUrl = require('../models/signature');

const associateSignatureWithApplicant = async (req, res, next) => {
  try {
    const newSignatureImageUrl = new SignatureImageUrl({ imageUrl: req.signatureImage.url });
    const savedSignatureImageUrl = await newSignatureImageUrl.save();

    const applicantId = req.body.applicantId; // Adjust this according to your app's data flow
    const applicant = await Applicant.findByIdAndUpdate(applicantId, {
      $push: { signatureImageUrls: savedSignatureImageUrl._id },
    });

    req.applicant = applicant;
    req.signatureImageUrl = savedSignatureImageUrl;
    next();
  } catch (error) {
    console.error('Error associating signature with applicant:', error);
    res.status(500).json({ error: 'An error occurred while associating the signature with the applicant' });
  }
};

module.exports = associateSignatureWithApplicant;
