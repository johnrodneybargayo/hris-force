// routes/apiKeyRoute.js
const express = require('express');
const router = express.Router();
const apiKey = require('./keys/loginAPI');

router.get('/api/get-api-key', (req, res) => {
  res.json({ apiKey });
});

module.exports = router;
