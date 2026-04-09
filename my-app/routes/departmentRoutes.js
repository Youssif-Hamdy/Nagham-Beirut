const express = require("express");
const router = express.Router();
const { getDepartments, createDepartment } = require("../controllers/departmentController");

router.get("/",  /* #swagger.tags = ['Departments'] */ getDepartments);
router.post("/", /* #swagger.tags = ['Departments'] */
  /* #swagger.parameters['body'] = {
    in: 'body', required: true,
    schema: { name: 'FOH' }
  } */
  createDepartment);

module.exports = router;