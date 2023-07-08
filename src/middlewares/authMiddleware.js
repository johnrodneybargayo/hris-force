const jwt = require('jsonwebtoken');
const secretKey = '431dd5dddcde37181d3816f9e604083693b7fc52873db4a8f2b009d51a23937f'; // Replace with your actual secret key


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.set('WWW-Authenticate', 'Bearer');
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  try {
    // Verify JWT token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.set('WWW-Authenticate', 'Bearer');
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Attach the decoded user ID to the request
      req.userId = decoded.userId;

      next();
    });
  } catch (error) {
    console.error(error);
    res.set('WWW-Authenticate', 'Bearer');
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
