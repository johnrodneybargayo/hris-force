const crypto = require('crypto');

// Generate a new secret key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString('hex');
  return secretKey;
};

// Example usage
const secretKey = generateSecretKey();
console.log(secretKey);
