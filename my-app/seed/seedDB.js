require("dotenv").config();
const mongoose = require("mongoose");
const Menu = require("../models/Menu");

const menuEn = require("./menu_en.json");
const menuAr = require("./menu_ar.json");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing data
    await Menu.deleteMany({});
    console.log("🗑️  Cleared existing menus");

    // Insert English menu
    await Menu.create(menuEn);
    console.log("✅ English menu inserted");

    // Insert Arabic menu
    await Menu.create(menuAr);
    console.log("✅ Arabic menu inserted");

    console.log("🌱 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
