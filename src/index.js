const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Netlify!' });
});

// Export the app wrapped with serverless-http
module.exports.handler = serverless(app);

// Start the server
const PORT = process.env.PORT || 3000; // Use the provided port or 3000 as default
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
