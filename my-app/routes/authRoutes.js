const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/employeeController");

router.post("/register", /* #swagger.tags = ['Auth'] */
  /* #swagger.parameters['body'] = {
    in: 'body', required: true,
    schema: { name: 'Ahmed Ali', phone: '01012345678', password: 'password', salary: 5000, role: 'ObjectId', department: 'ObjectId' }
  } */
  register);

router.post("/login", /* #swagger.tags = ['Auth'] */
  /* #swagger.parameters['body'] = {
    in: 'body', required: true,
    schema: { phone: '01012345678', password: 'password' }
  } */
  login);

module.exports = router;