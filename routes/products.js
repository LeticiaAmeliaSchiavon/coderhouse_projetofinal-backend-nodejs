const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

const productsFilePath = path.join(__dirname, '../data/products.json');

// Função para ler os produtos do arquivo
const readProducts = () => {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
};

// Função para escrever os produtos no arquivo
const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Listar todos os produtos
router.get('/', (req, res) => {
    const products = readProducts();
    const limit = req.query.limit;
    if (limit) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

// Obter um produto por ID
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

// Adicionar um novo produto
router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: (products.length + 1).toString(), // Gera um ID simples
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status !== undefined ? req.body.status : true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || []
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// Atualizar um produto
router.put('/:pid', (req, res) => {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex !== -1) {
        const updatedProduct = { ...products[productIndex], ...req.body };
        products[productIndex] = updatedProduct;
        writeProducts(products);
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

// Deletar um produto
router.delete('/:pid', (req, res) => {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        writeProducts(products);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

// Listar todos os produtos com filtros, paginação e ordenação
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = query ? { category: query } : {};
        const options = {
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const products = await Product.find(filter, null, options);
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? parseInt(page) - 1 : null,
            nextPage: page < totalPages ? parseInt(page) + 1 : null,
            page: parseInt(page),
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${parseInt(page) - 1}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort}&query=${query}` : null,
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;