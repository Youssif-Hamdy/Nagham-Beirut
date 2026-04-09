const Employee = require("../models/Employee");
const asyncHandler = require("../utils/asyncHandler");

exports.getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().populate("role").populate("department");
  res.json({ success: true, data: employees });
});

exports.getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("role").populate("department");
  if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, data: employee });
});

exports.createEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.create(req.body);
  res.status(201).json({ success: true, data: employee });
});

exports.updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, data: employee });
});

exports.deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, message: "Employee deleted" });
});