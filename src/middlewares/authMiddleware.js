// authMiddleware.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, secretKey);

    // Attach the decoded user ID to the request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
