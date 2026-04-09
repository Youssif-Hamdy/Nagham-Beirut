const express = require("express");
const router = express.Router();
const {
  getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee,
} = require("../controllers/employeeController");

router.get("/",    /* #swagger.tags = ['Employees'] */ getEmployees);
router.get("/:id", /* #swagger.tags = ['Employees'] */ getEmployee);
router.post("/",   /* #swagger.tags = ['Employees'] */
  /* #swagger.parameters['body'] = {
    in: 'body', required: true,
    schema: { name: 'Ahmed Ali', phone: '01012345678', salary: 5000, role: 'ObjectId', department: 'ObjectId' }
  } */
  createEmployee);
router.put("/:id", /* #swagger.tags = ['Employees'] */
  /* #swagger.parameters['body'] = {
    in: 'body',
    schema: { name: 'Ahmed Ali', phone: '01012345678', salary: 5000, role: 'ObjectId', department: 'ObjectId' }
  } */
  updateEmployee);
router.delete("/:id", /* #swagger.tags = ['Employees'] */ deleteEmployee);

module.exports = router;