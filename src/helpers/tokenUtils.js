const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;
const tokenExpiration = process.env.JWT_TOKEN_EXPIRATION || '15m';

const createAccessToken = (userId, isAdmin) => {
  const payload = {
    userId,
    isAdmin,
  };

  const options = {
    expiresIn: tokenExpiration,
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
};

module.exports = {
  createAccessToken,
};
