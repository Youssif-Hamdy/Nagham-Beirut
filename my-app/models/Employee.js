const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
  name:       { type: String,   required: true },
  phone:      { type: String,   required: true, unique: true },
  password:   { type: String,   required: true },
  salary:     { type: Number,   required: true },
  role:       { type: mongoose.Schema.Types.ObjectId, ref: "Role",       required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  createdAt:  { type: Date, default: Date.now },
});

// Hash password before saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Employee", employeeSchema);