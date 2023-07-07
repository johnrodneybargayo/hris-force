const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  try {
    // Verify JWT token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Attach the decoded user ID to the request
      req.userId = decoded.id;

      next();
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
