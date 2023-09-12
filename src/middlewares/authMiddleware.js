const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/User');
const { ApplicantModel } = require('../models/Applicant');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);

    const userId = decoded._id;

    // Determine the context of the request and choose the appropriate model
    let user;

    if (req.baseUrl === '/api/users') {
      user = await UserModel.findById(userId);
    } else if (req.baseUrl === '/api/applicants') {
      user = await ApplicantModel.findById(userId); // Use userId instead of ApplicantId
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Optionally, you can check if the user is authenticated using a flag or property
    if (!user.isAuthenticated) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    req.user = user; // Assign the user object to req.user
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }

    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
