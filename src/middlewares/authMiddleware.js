const jwt = require('jsonwebtoken');

const secretKey = '8956022d3c89a8f6df26bb32daa07127b8c605db3d00c52c5babe80eccbd33ec';

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
