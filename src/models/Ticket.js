const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  purchaseDatetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("Ticket", ticketSchema);
