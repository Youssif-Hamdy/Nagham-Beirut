const express = require("express");
const router = express.Router();
const { getRoles, createRole } = require("../controllers/roleController");

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Waiter }
 *     responses:
 *       201:
 *         description: Role created
 */

router.get("/", getRoles);
router.post("/", createRole);

module.exports = router;