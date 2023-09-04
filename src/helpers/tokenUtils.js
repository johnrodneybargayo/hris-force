const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const secretKey = process.env.JWT_SECRET; // Use environment variable for secret key

// Create an access token
const createAccessToken = (user) => {
  const data = {
    userId: user._id,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(data, secretKey, { expiresIn: '15m' }); // Set the expiration time to 15 minutes
  return token;
};

// Verify the access token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId; // Attach the user ID to the request
    next();
  });
};

// Decode the token
const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createAccessToken,
  verifyToken,
  decodeToken,
};
