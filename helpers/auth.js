const jwt = require('jsonwebtoken'); // Import jsonwebtoken module
const secret = '431dd5dddcde37181d3816f9e604083693b7fc52873db4a8f2b009d51a23937f'; // Secret can be any word or phrase

// Create an access token
module.exports.createAccessToken = (user) => {
  // User parameter comes from logging in
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, secret, {}); // Sign the data with the secret to create the access token
};

// Verify the access token
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization; // Get the token from the request headers

  if (typeof token !== 'undefined') {
    // If the token exists
    token = token.slice(7, token.length); // Remove the "Bearer " prefix from the token

    return jwt.verify(token, secret, (err, data) => {
      // Verify the token with the secret
      return err ? res.send({ auth: 'failed' }) : next(); // If the token is valid, call the next middleware
    });
  } else {
    // If the token is empty or undefined
    return res.send({ auth: 'failed' });
  }
};

// Decode the token
module.exports.decode = (token) => {
  if (typeof token !== 'undefined') {
    // If the token exists
    token = token.slice(7, token.length); // Remove the "Bearer " prefix from the token

    return jwt.verify(token, secret, (err, data) => {
      return err ? null : jwt.decode(token, { complete: true }).payload; // Decode the token and get the payload
    });
  } else {
    return null;
  }
};
