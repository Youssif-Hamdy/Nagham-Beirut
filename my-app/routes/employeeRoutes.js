const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const auth = require("../middlewares/auth");

router.get("/", /* #swagger.tags = ['Employees'] */ auth, getEmployees);
router.get("/:id", /* #swagger.tags = ['Employees'] */ auth, getEmployee);
router.post(
  "/" /* #swagger.tags = ['Employees'] */,
  /* #swagger.parameters['body'] = {
    in: 'body', required: true,
    schema: { name: 'Ahmed Ali', phone: '01012345678', password: 'password', salary: 5000, role: 'ObjectId', department: 'ObjectId' }
  } */
  auth,
  createEmployee,
);
router.put(
  "/:id" /* #swagger.tags = ['Employees'] */,
  /* #swagger.parameters['body'] = {
    in: 'body',
    schema: { name: 'Ahmed Ali', phone: '01012345678', password: 'password', salary: 5000, role: 'ObjectId', department: 'ObjectId' }
  } */
  auth,
  updateEmployee,
);
router.delete("/:id", /* #swagger.tags = ['Employees'] */ auth, deleteEmployee);

module.exports = router;
