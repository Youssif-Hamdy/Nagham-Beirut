const Employee = require("../models/Employee");
const Role = require("../models/Role");
const Department = require("../models/Department");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ id }, secret, { expiresIn: "30d" });
};

exports.registerEmployee = asyncHandler(async (req, res) => {
  let { name, phone, password, salary, role, department } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "phone and password are required" });
  }

  name = name || phone;
  salary = salary ?? 0;

  if (role) {
    if (typeof role === "string" && role.length < 24) {
      const roleDoc = await Role.findOne({ name: new RegExp(`^${role}$`, "i") });
      if (!roleDoc) return res.status(400).json({ success: false, message: `Role "${role}" مش موجود` });
      role = roleDoc._id;
    }
  } else {
    let roleDoc = await Role.findOne({ name: new RegExp("^User$", "i") });
    if (!roleDoc) roleDoc = await Role.create({ name: "User" });
    role = roleDoc._id;
  }

  if (department) {
    if (typeof department === "string" && department.length < 24) {
      const deptDoc = await Department.findOne({ name: new RegExp(`^${department}$`, "i") });
      if (!deptDoc) return res.status(400).json({ success: false, message: `Department "${department}" مش موجود` });
      department = deptDoc._id;
    }
  } else {
    let deptDoc = await Department.findOne({ name: new RegExp("^General$", "i") });
    if (!deptDoc) deptDoc = await Department.create({ name: "General" });
    department = deptDoc._id;
  }

  const employee = await Employee.create({ name, phone, password, salary, role, department });
  res.status(201).json({ 
    success: true, 
    data: employee,
    token: generateToken(employee._id)
  });
});

exports.loginEmployee = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: "phone and password are required" });
  }

  const employee = await Employee.findOne({ phone }).populate("role").populate("department");

  if (employee && (await employee.matchPassword(password))) {
    res.json({
      success: true,
      token: generateToken(employee._id),
      data: employee,
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});
