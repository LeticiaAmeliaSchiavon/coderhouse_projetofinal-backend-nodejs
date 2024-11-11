const express = require('express');
const router = express.Router();
const fs = require('fs');

// Carregar produtos
const loadProducts = () => {
    const data = fs.readFileSync('./produtos.json', 'utf-8');
    return JSON.parse(data);
};

// Salvar produtos
const saveProducts = (products) => {
    fs.writeFileSync('./produtos.json', JSON.stringify(products, null, 2));
};

// Listar todos os produtos
router.get('/', (req, res) => {
    const products = loadProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

// Produto por ID
router.get('/:pid', (req, res) => {
    const products = loadProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
});

// Adicionar produto
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const products = loadProducts();
    const id = String(products.length ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1);
    const newProduct = { id, title, description, code, price, stock, category, thumbnails, status: true };
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

// Atualizar um produto por ID
router.put('/:pid', (req, res) => {
    const products = loadProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });

    const updatedProduct = { ...products[index], ...req.body, id: products[index].id };
    products[index] = updatedProduct;
    saveProducts(products);
    res.json(updatedProduct);
});

// Remover um produto por ID
router.delete('/:pid', (req, res) => {
    const products = loadProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });

    products.splice(index, 1);
    saveProducts(products);
    res.status(204).send();
});

module.exports = router;
