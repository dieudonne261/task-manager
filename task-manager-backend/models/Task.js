const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date_creation: { type: Date, default: Date.now },
  date_fin: { type: Date, default: null },
});

module.exports = mongoose.model("Task", taskSchema);