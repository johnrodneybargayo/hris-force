const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  modelNo: { type: String, required: true },
  serialNo: { type: String, required: true },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
