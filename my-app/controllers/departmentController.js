const Department = require("../models/Department");
const asyncHandler = require("../utils/asyncHandler");

exports.getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find();
  res.json({ success: true, data: departments });
});

exports.createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json({ success: true, data: department });
});