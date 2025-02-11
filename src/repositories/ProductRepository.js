class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll() {
        return await this.dao.getAllProducts();
    }

    async getById(id) {
        return await this.dao.getProductById(id);
    }
}

module.exports = ProductRepository;