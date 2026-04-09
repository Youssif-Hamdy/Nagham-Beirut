const Role = require("../models/Role");
const asyncHandler = require("../utils/asyncHandler");

exports.getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find();
  res.json({ success: true, data: roles });
});

exports.createRole = asyncHandler(async (req, res) => {
  const role = await Role.create(req.body);
  res.status(201).json({ success: true, data: role });
});