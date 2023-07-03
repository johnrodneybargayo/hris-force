const express = require('express');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

app.use("/.netlify/functions/index", router);

// Export the app wrapped with serverless-http
module.exports.handler = serverless(app);


// Start the server
const PORT = process.env.PORT || 3000; // Use the provided port or 3000 as default
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
