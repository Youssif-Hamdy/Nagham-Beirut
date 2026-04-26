const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    uncertain: {
      type: Boolean,
      default: false,
    },
    isOffer: {
      type: Boolean,
      default: false,
    },
    offerDiscount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    items: [itemSchema],
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      enum: ["en", "ar"],
      unique: true,
    },
    source_note: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "EGP",
    },
    categories: [categorySchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Menu", menuSchema);