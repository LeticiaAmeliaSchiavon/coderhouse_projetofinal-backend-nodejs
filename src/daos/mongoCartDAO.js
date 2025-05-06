const Cart = require("../models/Cart");

class MongoCartDAO {
  async getCartById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async createCart() {
    const cart = new Cart({ products: [] });
    return await cart.save();
  }

  async addToCart(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    const item = cart.products.find((p) => p.product.toString() === productId);

    if (item) item.quantity += quantity;
    else cart.products.push({ product: productId, quantity });

    return await cart.save();
  }
}
module.exports = MongoCartDAO;
