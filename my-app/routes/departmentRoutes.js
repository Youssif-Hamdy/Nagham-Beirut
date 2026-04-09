const express = require("express");
const router = express.Router();
const { getDepartments, createDepartment } = require("../controllers/departmentController");

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of departments
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: FOH }
 *     responses:
 *       201:
 *         description: Department created
 */

router.get("/", getDepartments);
router.post("/", createDepartment);

module.exports = router;