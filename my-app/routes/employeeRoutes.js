const express = require("express");
const router = express.Router();
const {
  getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee,
} = require("../controllers/employeeController");

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of all employees
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, salary, role, department]
 *             properties:
 *               name:       { type: string,  example: Ahmed Ali }
 *               phone:      { type: string,  example: "01012345678" }
 *               salary:     { type: number,  example: 5000 }
 *               role:       { type: string,  example: 64f1a2b3c4d5e6f7a8b9c0d1 }
 *               department: { type: string,  example: 64f1a2b3c4d5e6f7a8b9c0d2 }
 *     responses:
 *       201:
 *         description: Employee created
 */

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Employee data
 *       404:
 *         description: Employee not found
 *   put:
 *     summary: Update employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:       { type: string }
 *               phone:      { type: string }
 *               salary:     { type: number }
 *               role:       { type: string }
 *               department: { type: string }
 *     responses:
 *       200:
 *         description: Employee updated
 *       404:
 *         description: Employee not found
 *   delete:
 *     summary: Delete employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Employee deleted
 *       404:
 *         description: Employee not found
 */

router.get("/", getEmployees);
router.get("/:id", getEmployee);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;