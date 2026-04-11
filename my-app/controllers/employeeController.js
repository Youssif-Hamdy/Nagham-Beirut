const Employee   = require("../models/Employee");
const Role       = require("../models/Role");
const Department = require("../models/Department");
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
  let { name, phone, password, salary, role, department } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: "name and phone are required" });
  }

  // password اختياري - افتراضي: phone
  password = password || phone;

  // معالجة role
  if (role) {
    if (typeof role === "string") {
      if (role.length === 24 || role.match(/^[0-9a-fA-F]{24}$/)) {
        // هو ID بالفعل
        const roleExists = await Role.findById(role);
        if (!roleExists) return res.status(400).json({ success: false, message: "Role ID not found" });
      } else {
        // ابحث عن role باسمه
        const roleDoc = await Role.findOne({ name: new RegExp(`^${role}$`, "i") });
        if (!roleDoc) return res.status(400).json({ success: false, message: `Role "${role}" not found` });
        role = roleDoc._id;
      }
    }
  } else {
    let roleDoc = await Role.findOne({ name: new RegExp("^User$", "i") });
    if (!roleDoc) roleDoc = await Role.create({ name: "User" });
    role = roleDoc._id;
  }

  // معالجة department
  if (department) {
    if (typeof department === "string") {
      if (department.length === 24 || department.match(/^[0-9a-fA-F]{24}$/)) {
        // هو ID بالفعل
        const deptExists = await Department.findById(department);
        if (!deptExists) return res.status(400).json({ success: false, message: "Department ID not found" });
      } else {
        // ابحث عن department باسمه
        const deptDoc = await Department.findOne({ name: new RegExp(`^${department}$`, "i") });
        if (!deptDoc) return res.status(400).json({ success: false, message: `Department "${department}" not found` });
        department = deptDoc._id;
      }
    }
  } else {
    let deptDoc = await Department.findOne({ name: new RegExp("^General$", "i") });
    if (!deptDoc) deptDoc = await Department.create({ name: "General" });
    department = deptDoc._id;
  }

  const employee = await Employee.create({ name, phone, password, salary: salary ?? 3000, role, department });
  res.status(201).json({ success: true, data: employee });
});

exports.updateEmployee = asyncHandler(async (req, res) => {
  let { role, department, ...rest } = req.body;

  // معالجة role
  if (role) {
    if (typeof role === "string") {
      if (role.length === 24 || role.match(/^[0-9a-fA-F]{24}$/)) {
        const roleExists = await Role.findById(role);
        if (!roleExists) return res.status(400).json({ success: false, message: "Role ID not found" });
      } else {
        const roleDoc = await Role.findOne({ name: new RegExp(`^${role}$`, "i") });
        if (!roleDoc) return res.status(400).json({ success: false, message: `Role "${role}" not found` });
        role = roleDoc._id;
      }
    }
  }

  // معالجة department
  if (department) {
    if (typeof department === "string") {
      if (department.length === 24 || department.match(/^[0-9a-fA-F]{24}$/)) {
        const deptExists = await Department.findById(department);
        if (!deptExists) return res.status(400).json({ success: false, message: "Department ID not found" });
      } else {
        const deptDoc = await Department.findOne({ name: new RegExp(`^${department}$`, "i") });
        if (!deptDoc) return res.status(400).json({ success: false, message: `Department "${department}" not found` });
        department = deptDoc._id;
      }
    }
  }

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { ...rest, ...(role && { role }), ...(department && { department }) },
    { new: true, runValidators: true }
  ).populate("role").populate("department");
  if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, data: employee });
});

exports.deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, message: "Employee deleted" });
});