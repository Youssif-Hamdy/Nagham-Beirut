const Menu = require("../models/Menu");
const imagekit = require("../utils/imagekit");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Helper: يحسب السعر بعد الخصم
const calcOfferPrice = (price, discount) => {
  if (!discount || discount <= 0) return price;
  return parseFloat((price - (price * discount) / 100).toFixed(2));
};

// ─────────────────────────────────────────────
// GET /api/menu
// ─────────────────────────────────────────────
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json({ success: true, count: menus.length, data: menus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/menu/:lang
// ─────────────────────────────────────────────
exports.getMenuByLang = async (req, res) => {
  try {
    const menu = await Menu.findOne({ language: req.params.lang });
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: `No menu found for language: ${req.params.lang}`,
      });
    }
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/menu/:lang/items/:itemId
// ─────────────────────────────────────────────
exports.getItemById = async (req, res) => {
  try {
    const menu = await Menu.findOne({ language: req.params.lang });
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: `No menu found for language: ${req.params.lang}`,
      });
    }

    let foundItem = null;
    let foundCategory = null;

    for (const cat of menu.categories) {
      const item = cat.items.id(req.params.itemId);
      if (item) {
        foundItem = item;
        foundCategory = cat.name;
        break;
      }
    }

    if (!foundItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const itemObj = foundItem.toObject();
    if (itemObj.isOffer) {
      itemObj.offerPrice = calcOfferPrice(itemObj.price, itemObj.offerDiscount);
    }

    res.status(200).json({
      success: true,
      data: { category: foundCategory, item: itemObj },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/menu/:lang/items
// ─────────────────────────────────────────────
exports.addItem = async (req, res) => {
  try {
    const {
      categoryName,
      name,
      price,
      description,
      uncertain,
      isOffer,
      offerDiscount,
      isBestSeller,
    } = req.body;

    if (!categoryName || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "categoryName, name, and price are required",
      });
    }

    const menu = await Menu.findOne({ language: req.params.lang });
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: `No menu found for language: ${req.params.lang}`,
      });
    }

    let category = menu.categories.find((c) => c.name === categoryName);
    if (!category) {
      menu.categories.push({ name: categoryName, items: [] });
      category = menu.categories[menu.categories.length - 1];
    }

    const newItem = {
      name,
      price,
      description: description || "",
      uncertain: uncertain || false,
      isOffer: isOffer || false,
      offerDiscount: isOffer ? (offerDiscount || 0) : 0,
      isBestSeller: isBestSeller || false,
    };
    category.items.push(newItem);
    await menu.save();

    const savedItem = category.items[category.items.length - 1].toObject();
    if (savedItem.isOffer) {
      savedItem.offerPrice = calcOfferPrice(savedItem.price, savedItem.offerDiscount);
    }

    res.status(201).json({ success: true, data: savedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ─────────────────────────────────────────────
// POST /api/menu/:lang/categories/:categoryName/image
// ─────────────────────────────────────────────
exports.uploadCategoryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const { lang, categoryName } = req.params;

    const menu = await Menu.findOne({ language: lang });
    if (!menu) {
      return res.status(404).json({ success: false, message: `No menu found for language: ${lang}` });
    }

    const category = menu.categories.find((c) => c.name === categoryName);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `category_${categoryName}_${Date.now()}`,
      folder: "/menu/categories",
    });

    category.image = uploadResponse.url;
    await menu.save();

    res.status(200).json({ success: true, imageUrl: uploadResponse.url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/menu/:lang/categories/:categoryName/image
// ─────────────────────────────────────────────
exports.updateCategoryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const { lang, categoryName } = req.params;

    const menu = await Menu.findOne({ language: lang });
    if (!menu) {
      return res.status(404).json({ success: false, message: `No menu found for language: ${lang}` });
    }

    const category = menu.categories.find((c) => c.name === categoryName);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `category_${categoryName}_${Date.now()}`,
      folder: "/menu/categories",
    });

    category.image = uploadResponse.url;
    await menu.save();

    res.status(200).json({ success: true, imageUrl: uploadResponse.url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// ─────────────────────────────────────────────
// PUT /api/menu/:lang/items/:itemId
// ─────────────────────────────────────────────
exports.updateItem = async (req, res) => {
  try {
    const menu = await Menu.findOne({ language: req.params.lang });
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: `No menu found for language: ${req.params.lang}`,
      });
    }

    let foundItem = null;
    for (const cat of menu.categories) {
      foundItem = cat.items.id(req.params.itemId);
      if (foundItem) break;
    }

    if (!foundItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const { name, price, description, uncertain, isOffer, offerDiscount, isBestSeller } = req.body;
    if (name !== undefined) foundItem.name = name;
    if (price !== undefined) foundItem.price = price;
    if (description !== undefined) foundItem.description = description;
    if (uncertain !== undefined) foundItem.uncertain = uncertain;
    if (isOffer !== undefined) foundItem.isOffer = isOffer;
    if (offerDiscount !== undefined) foundItem.offerDiscount = offerDiscount;
    // لو اتحذف الـ offer، امسح الخصم تلقائياً
    if (isOffer === false) foundItem.offerDiscount = 0;
    if (isBestSeller !== undefined) foundItem.isBestSeller = isBestSeller;

    await menu.save();

    const itemObj = foundItem.toObject();
    if (itemObj.isOffer) {
      itemObj.offerPrice = calcOfferPrice(itemObj.price, itemObj.offerDiscount);
    }

    res.status(200).json({ success: true, data: itemObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/menu/:lang/offers
// ─────────────────────────────────────────────
exports.getOffersByLang = async (req, res) => {
  try {
    const menu = await Menu.findOne({ language: req.params.lang });
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: `No menu found for language: ${req.params.lang}`,
      });
    }

    const offers = [];
    for (const category of menu.categories) {
      for (const item of category.items) {
        if (item.isOffer) {
          const itemObj = item.toObject();
          itemObj.offerPrice = calcOfferPrice(itemObj.price, itemObj.offerDiscount);
          offers.push({ category: category.name, item: itemObj });
        }
      }
    }

    res.status(200).json({ success: true, count: offers.length, data: offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/menu/:lang/best-sellers
// ─────────────────────────────────────────────
exports.getBestSellersByLang = async (req, res) => {
  try {
    const menu = await Menu.findOne({ language: req.params.lang });
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: `No menu found for language: ${req.params.lang}`,
      });
    }

    const bestSellers = [];
    for (const category of menu.categories) {
      for (const item of category.items) {
        if (item.isBestSeller) {
          const itemObj = item.toObject();
          if (itemObj.isOffer) {
            itemObj.offerPrice = calcOfferPrice(itemObj.price, itemObj.offerDiscount);
          }
          bestSellers.push({ category: category.name, item: itemObj });
        }
      }
    }

    res.status(200).json({ success: true, count: bestSellers.length, data: bestSellers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/menu/:lang/items/:itemId
// ─────────────────────────────────────────────
exports.deleteItem = async (req, res) => {
  try {
    const menu = await Menu.findOne({ language: req.params.lang });
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: `No menu found for language: ${req.params.lang}`,
      });
    }

    let deleted = false;
    for (const cat of menu.categories) {
      const item = cat.items.id(req.params.itemId);
      if (item) {
        item.deleteOne();
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    await menu.save();
    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};