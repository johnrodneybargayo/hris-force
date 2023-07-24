const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventoryItemModel'); // Adjust the path to the correct file

router.post('/', async (req, res) => {
  try {
    // Create a new Inventory document using the request body
    const newEquipment = new Inventory(req.body);
    // Save the new document to the 'Inventory' collection
    const savedEquipment = await newEquipment.save();
    res.json(savedEquipment);
  } catch (error) {
    console.error('Error occurred while adding equipment:', error);
    res.status(500).json({ error: 'An error occurred while adding equipment' });
  }
});

module.exports = router;
