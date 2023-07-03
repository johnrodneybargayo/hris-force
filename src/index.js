const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Netlify!' });
});

// Export the app wrapped with serverless-http
module.exports.handler = serverless(app);
