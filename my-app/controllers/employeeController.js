const Employee   = require("../models/Employee");
const Role       = require("../models/Role");
const Department = require("../models/Department");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

exports.getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().populate("role").populate("department");
  res.json({ success: true, data: employees });
});

exports.getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("role").populate("department");
  if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, data: employee });
});

exports.register = asyncHandler(async (req, res) => {
  let { name, phone, password, salary, role, department } = req.body;

  // لو بعتلي اسم بدل ID — ابحث تلقائياً
  if (role && typeof role === "string" && role.length < 24) {
    const roleDoc = await Role.findOne({ name: new RegExp(`^${role}$`, "i") });
    if (!roleDoc) return res.status(400).json({ success: false, message: `Role "${role}" مش موجود` });
    role = roleDoc._id;
  }

  if (department && typeof department === "string" && department.length < 24) {
    const deptDoc = await Department.findOne({ name: new RegExp(`^${department}$`, "i") });
    if (!deptDoc) return res.status(400).json({ success: false, message: `Department "${department}" مش موجود` });
    department = deptDoc._id;
  }

  const employee = await Employee.create({ name, phone, password, salary, role, department });
  res.status(201).json({ success: true, data: employee });
});

exports.login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const employee = await Employee.findOne({ phone });

  if (employee && (await employee.matchPassword(password))) {
    res.json({
      success: true,
      token: jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "30d" }),
      data: employee,
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

exports.createEmployee = asyncHandler(async (req, res) => {
  let { name, phone, password, salary, role, department } = req.body;

  // لو بعتلي اسم بدل ID — ابحث تلقائياً
  if (role && typeof role === "string" && role.length < 24) {
    const roleDoc = await Role.findOne({ name: new RegExp(`^${role}$`, "i") });
    if (!roleDoc) return res.status(400).json({ success: false, message: `Role "${role}" مش موجود` });
    role = roleDoc._id;
  }

  if (department && typeof department === "string" && department.length < 24) {
    const deptDoc = await Department.findOne({ name: new RegExp(`^${department}$`, "i") });
    if (!deptDoc) return res.status(400).json({ success: false, message: `Department "${department}" مش موجود` });
    department = deptDoc._id;
  }

  const employee = await Employee.create({ name, phone, password, salary, role, department });
  res.status(201).json({ success: true, data: employee });
});

exports.updateEmployee = asyncHandler(async (req, res) => {
  let { role, department, ...rest } = req.body;

  if (role && typeof role === "string" && role.length < 24) {
    const roleDoc = await Role.findOne({ name: new RegExp(`^${role}$`, "i") });
    if (!roleDoc) return res.status(400).json({ success: false, message: `Role "${role}" مش موجود` });
    role = roleDoc._id;
  }

  if (department && typeof department === "string" && department.length < 24) {
    const deptDoc = await Department.findOne({ name: new RegExp(`^${department}$`, "i") });
    if (!deptDoc) return res.status(400).json({ success: false, message: `Department "${department}" مش موجود` });
    department = deptDoc._id;
  }

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { ...rest, ...(role && { role }), ...(department && { department }) },
    { new: true, runValidators: true }
  );
  if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, data: employee });
});

exports.deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, message: "Employee deleted" });
});