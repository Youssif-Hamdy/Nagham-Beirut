const Employee = require("../models/Employee");
const Role = require("../models/Role");
const Department = require("../models/Department");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ id }, secret, { expiresIn: "30d" });
};

exports.register = asyncHandler(async (req, res) => {
  const { name, phone, password, salary, role, department } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: "name and password are required" });
  }

  // لو في phone = موظف، لو مش في = مستخدم عام
  if (phone) {
    // Register Employee
    let roleId = role;
    let departmentId = department;

    name = name || phone;

    if (roleId) {
      if (typeof roleId === "string" && roleId.length < 24) {
        const roleDoc = await Role.findOne({ name: new RegExp(`^${roleId}$`, "i") });
        if (!roleDoc) return res.status(400).json({ success: false, message: `Role "${roleId}" مش موجود` });
        roleId = roleDoc._id;
      }
    } else {
      let roleDoc = await Role.findOne({ name: new RegExp("^User$", "i") });
      if (!roleDoc) roleDoc = await Role.create({ name: "User" });
      roleId = roleDoc._id;
    }

    if (departmentId) {
      if (typeof departmentId === "string" && departmentId.length < 24) {
        const deptDoc = await Department.findOne({ name: new RegExp(`^${departmentId}$`, "i") });
        if (!deptDoc) return res.status(400).json({ success: false, message: `Department "${departmentId}" مش موجود` });
        departmentId = deptDoc._id;
      }
    } else {
      let deptDoc = await Department.findOne({ name: new RegExp("^General$", "i") });
      if (!deptDoc) deptDoc = await Department.create({ name: "General" });
      departmentId = deptDoc._id;
    }

    const employee = await Employee.create({ 
      name, 
      phone, 
      password, 
      salary: salary ?? 0,
      role: roleId, 
      department: departmentId 
    });

    res.status(201).json({ 
      success: true, 
      data: employee,
      token: generateToken(employee._id),
      type: "employee"
    });
  } else {
    // Register User
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, password });
    res.status(201).json({ 
      success: true, 
      data: { id: user._id, name: user.name }, 
      token: generateToken(user._id),
      type: "user"
    });
  }
});

exports.login = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "password is required" });
  }

  // لو في phone = employee login، لو in name = user login
  if (phone) {
    // Employee Login
    if (!phone) {
      return res.status(400).json({ success: false, message: "phone is required" });
    }

    const employee = await Employee.findOne({ phone }).populate("role").populate("department");

    if (employee && (await employee.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(employee._id),
        data: employee,
        type: "employee"
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } else if (name) {
    // User Login
    const user = await User.findOne({ name });
    if (user && (await user.matchPassword(password))) {
      res.json({ 
        success: true, 
        token: generateToken(user._id), 
        data: { id: user._id, name: user.name },
        type: "user"
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } else {
    res.status(400).json({ success: false, message: "name (user) or phone (employee) is required" });
  }
});

