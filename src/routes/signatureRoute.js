const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const upload = multer(); // Initialize multer instance

const signatureController = require('../controllers/signatureController');

// POST route to handle signature upload
router.post('/api/signature', upload.single('profile'), signatureController.uploadSignature);

module.exports = router;
