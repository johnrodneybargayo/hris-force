const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;

    // Check if the user exists and is authenticated
    const user = await UserModel.findById(userId);

    if (!user || !user.isAuthenticated) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    req.userId = userId;
    next();
  });
};

module.exports = authMiddleware;
