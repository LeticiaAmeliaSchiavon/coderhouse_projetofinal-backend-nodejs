class MemoryDAO {
  constructor() {
    this.products = [];
  }

  async getAllProducts() {
    return this.products;
  }

  async getProductById(id) {
    return this.products.find((p) => p.id === id);
  }

  async createProduct(productData) {
    const newProduct = { id: Date.now().toString(), ...productData };
    this.products.push(newProduct);
    return newProduct;
  }
}
module.exports = MemoryDAO;
