const mongoose = require("mongoose");

const { Schema } = mongoose;

const imageSchema = new Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ImageModel = mongoose.model("Image", imageSchema);

module.exports = ImageModel;
