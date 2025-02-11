const Product = require('../models/Product');

class MongoDAO {
    async getAllProducts() {
        return await Product.find();
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async createProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }
}

module.exports = MongoDAO;