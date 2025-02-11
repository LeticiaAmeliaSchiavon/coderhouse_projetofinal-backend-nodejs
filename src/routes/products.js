const express = require('express');
const router = express.Router();
const ProductRepository = require('../repositories/ProductRepository');
const MongoDAO = require('../daos/mongoDAO');
const { isAdmin } = require('../middlewares/authMiddleware');
const Product = require('../models/Product');

const productRepository = new ProductRepository(new MongoDAO());

// Listar todos os produtos
router.get('/', async (req, res) => {
    const products = await productRepository.getAll();
    res.json(products);
});

// Adicionar um novo produto (somente admin)
router.post('/', isAdmin, async (req, res) => {
    const product = await productRepository.createProduct(req.body);
    res.status(201).json(product);
});

module.exports = router;