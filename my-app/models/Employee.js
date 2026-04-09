const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name:       { type: String,   required: true },
  phone:      { type: String,   required: true },
  salary:     { type: Number,   required: true },
  role:       { type: mongoose.Schema.Types.ObjectId, ref: "Role",       required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  createdAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);