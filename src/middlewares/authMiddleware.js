const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UserModel } = require('../models/User');
const { ApplicantModel } = require('../models/Applicant'); // Import ApplicantModel if needed

const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the "Authorization" header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;
    const baseUrl = req.baseUrl;

    // Define the user model based on the request base URL
    let userModel;

    if (baseUrl === '/api/users') {
      userModel = UserModel;
    } else if (baseUrl === '/api/applicants') {
      if (!req.params.applicantId) {
        return res.status(400).json({ message: 'applicantId missing in route params' });
      }
      userModel = ApplicantModel; // Assuming you have an "ApplicantModel" defined
    } else if (baseUrl === '/api/notes') {
      req.userId = userId;
    }

    if (!userModel) {
      // Handle the case where the baseUrl doesn't match any of the expected values
      return res.status(400).json({ message: 'Invalid base URL' });
    }

    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: `${userModel.modelName} not found` });
    }

    if (!user.isAuthenticated) {
      return res.status(401).json({ message: `${userModel.modelName} not authenticated` });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }

    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authMiddleware;
