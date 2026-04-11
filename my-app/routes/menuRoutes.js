const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/menuController");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *           description: السعر الأصلي
 *         description:
 *           type: string
 *         uncertain:
 *           type: boolean
 *         isOffer:
 *           type: boolean
 *         offerDiscount:
 *           type: number
 *           description: نسبة الخصم (0-100)
 *         offerPrice:
 *           type: number
 *           description: السعر بعد الخصم (محسوب تلقائياً)
 *         isBestSeller:
 *           type: boolean
 *       example:
 *         _id: "663abc123def456"
 *         name: "Om Ali"
 *         price: 100
 *         isOffer: true
 *         offerDiscount: 20
 *         offerPrice: 80
 *         isBestSeller: true
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
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         uncertain:
 *           type: boolean
 *         isOffer:
 *           type: boolean
 *         offerDiscount:
 *           type: number
 *           description: نسبة الخصم (0-100) - مطلوبة لو isOffer = true
 *         isBestSeller:
 *           type: boolean
 *       example:
 *         categoryName: "Desserts"
 *         name: "Kunafa"
 *         price: 100
 *         isOffer: true
 *         offerDiscount: 20
 *         isBestSeller: false
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
 *         isOffer:
 *           type: boolean
 *         offerDiscount:
 *           type: number
 *         isBestSeller:
 *           type: boolean
 */

router.get("/", ctrl.getAllMenus);
router.get("/:lang", ctrl.getMenuByLang);
router.get("/:lang/offers", ctrl.getOffersByLang);
router.get("/:lang/best-sellers", ctrl.getBestSellersByLang);
router.get("/:lang/items/:itemId", ctrl.getItemById);
router.post("/:lang/items", auth, ctrl.addItem);
router.put("/:lang/items/:itemId", auth, ctrl.updateItem);
router.delete("/:lang/items/:itemId", auth, ctrl.deleteItem);

module.exports = router;