const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.register = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: "name and password are required" });
  }

  const existingUser = await User.findOne({ name });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const user = await User.create({ name, password });
  res.status(201).json({ success: true, data: { id: user._id, name: user.name }, token: generateToken(user._id) });
});

exports.login = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false, message: "name and password are required" });
  }

  const user = await User.findOne({ name });
  if (user && (await user.matchPassword(password))) {
    res.json({ success: true, token: generateToken(user._id), data: { id: user._id, name: user.name } });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});
