class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getCart(id) {
    return await this.dao.getCartById(id);
  }

  async createCart() {
    return await this.dao.createCart();
  }

  async addToCart(cartId, productId, quantity) {
    return await this.dao.addToCart(cartId, productId, quantity);
  }
}
module.exports = CartRepository;
