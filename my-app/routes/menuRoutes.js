const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/menuController");

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Item name
 *         price:
 *           type: number
 *           description: Item price in EGP
 *         description:
 *           type: string
 *           description: Item description
 *         uncertain:
 *           type: boolean
 *           description: Whether the item name/price is uncertain
 *       example:
 *         _id: "663abc123def456"
 *         name: "Om Ali"
 *         price: 120
 *         description: "Traditional Egyptian bread pudding with cream"
 *         uncertain: false
 *
 *     NewItem:
 *       type: object
 *       required:
 *         - categoryName
 *         - name
 *         - price
 *       properties:
 *         categoryName:
 *           type: string
 *           description: Category to add item into (created if not exists)
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         uncertain:
 *           type: boolean
 *       example:
 *         categoryName: "Desserts"
 *         name: "Kunafa"
 *         price: 85
 *         description: "Sweet cheese pastry with sugar syrup"
 *         uncertain: false
 *
 *     UpdateItem:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         uncertain:
 *           type: boolean
 *       example:
 *         price: 95
 *         description: "Updated description here"
 */

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL MENUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all menus (all languages)
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List of all menus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 */
router.get("/", ctrl.getAllMenus);

// ─────────────────────────────────────────────────────────────────────────────
// GET MENU BY LANGUAGE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/menu/{lang}:
 *   get:
 *     summary: Get menu by language
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *         description: Language code (en or ar)
 *     responses:
 *       200:
 *         description: Menu data
 *       404:
 *         description: Menu not found
 */
router.get("/:lang", ctrl.getMenuByLang);

// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE ITEM BY ID
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/menu/{lang}/items/{itemId}:
 *   get:
 *     summary: Get a single item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id of the item
 *     responses:
 *       200:
 *         description: Item found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                     item:
 *                       $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
router.get("/:lang/items/:itemId", ctrl.getItemById);

// ─────────────────────────────────────────────────────────────────────────────
// POST - ADD ITEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/menu/{lang}/items:
 *   post:
 *     summary: Add a new item to a category
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewItem'
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Menu not found
 */
router.post("/:lang/items", ctrl.addItem);

// ─────────────────────────────────────────────────────────────────────────────
// PUT - UPDATE ITEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/menu/{lang}/items/{itemId}:
 *   put:
 *     summary: Update an existing item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id of the item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItem'
 *     responses:
 *       200:
 *         description: Item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *       404:
 *         description: Menu or Item not found
 */
router.put("/:lang/items/:itemId", ctrl.updateItem);

// ─────────────────────────────────────────────────────────────────────────────
// DELETE - DELETE ITEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/menu/{lang}/items/{itemId}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [en, ar]
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id of the item
 *     responses:
 *       200:
 *         description: Item deleted
 *       404:
 *         description: Menu or Item not found
 */
router.delete("/:lang/items/:itemId", ctrl.deleteItem);

module.exports = router;
