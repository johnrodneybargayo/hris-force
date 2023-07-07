const jwt = require('jsonwebtoken');
const secretKey = '431dd5dddcde37181d3816f9e604083693b7fc52873db4a8f2b009d51a23937f';

// Create an access token
const createAccessToken = (user) => {
  const data = {
    userId: user._id,
    email: user.email,
    password: user.password,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(data, secretKey);
  return JSON.stringify({ token });
};

// Verify the access token
const verify = (req, res, next) => {
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
const decode = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createAccessToken,
  verify,
  decode,
};
