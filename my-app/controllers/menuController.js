const Menu = require("../models/Menu");

// ─────────────────────────────────────────────
// GET /api/menu
// Returns all menus (en + ar)
// ─────────────────────────────────────────────
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/menu/:lang
// Returns menu by language (en or ar)
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
// Returns a single item by its _id
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

    res.status(200).json({
      success: true,
      data: { category: foundCategory, item: foundItem },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/menu/:lang/items
// Add a new item to a category
// Body: { categoryName, name, price, description, uncertain }
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

    // Find or create category
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
      isBestSeller: isBestSeller || false,
    };
    category.items.push(newItem);

    await menu.save();

    // Return the newly added item
    const savedItem = category.items[category.items.length - 1];
    res.status(201).json({ success: true, data: savedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// PUT /api/menu/:lang/items/:itemId
// Update an item by its _id
// Body: { name?, price?, description?, uncertain?, categoryName? }
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

    const { name, price, description, uncertain, isOffer, isBestSeller } = req.body;
    if (name !== undefined) foundItem.name = name;
    if (price !== undefined) foundItem.price = price;
    if (description !== undefined) foundItem.description = description;
    if (uncertain !== undefined) foundItem.uncertain = uncertain;
    if (isOffer !== undefined) foundItem.isOffer = isOffer;
    if (isBestSeller !== undefined) foundItem.isBestSeller = isBestSeller;

    await menu.save();
    res.status(200).json({ success: true, data: foundItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/menu/:lang/offers
// Returns all items marked as offers
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
          offers.push({ category: category.name, item });
        }
      }
    }

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/menu/:lang/best-sellers
// Returns all items marked as best sellers
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
          bestSellers.push({ category: category.name, item });
        }
      }
    }

    res.status(200).json({
      success: true,
      count: bestSellers.length,
      data: bestSellers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/menu/:lang/items/:itemId
// Delete an item by its _id
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
