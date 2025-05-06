const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  products: [cartItemSchema],
});

module.exports = mongoose.model("Cart", cartSchema);
