const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;
const tokenExpiration = process.env.JWT_TOKEN_EXPIRATION || '1h';

function createAccessToken(userId, isAdmin) {
  const payload = {
    userId,
    isAdmin,
  };

  const options = {
    expiresIn: tokenExpiration,
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
}

function createNoteAccessToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: tokenExpiration });
}

function verifyNoteAccessToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null; // Token is invalid
  }
}

module.exports = {
  createAccessToken,
  createNoteAccessToken,
  verifyNoteAccessToken,
};
