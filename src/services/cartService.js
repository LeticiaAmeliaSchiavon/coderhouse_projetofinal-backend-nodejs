const Cart = require("../models/Cart");

module.exports = {
  async getCartById(cartId) {
    return await Cart.findById(cartId).populate({
      path: "products.product",
      model: "Product",
    });
  },

  async updateCartAfterPurchase(cartId, remainingProducts) {
    return await Cart.findByIdAndUpdate(cartId, {
      products: remainingProducts,
    });
  },
};
