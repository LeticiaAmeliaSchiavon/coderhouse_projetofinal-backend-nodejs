const express = require('express');
const router = express.Router();
const fs = require('fs');

// Carregar o carrinho
const loadCarts = () => {
    const data = fs.readFileSync('./carrito.json', 'utf-8');
    return JSON.parse(data);
};

// Salvar o carrinho
const saveCarts = (carts) => {
    fs.writeFileSync('./carrito.json', JSON.stringify(carts, null, 2));
};

// Criar um novo carrinho
router.post('/', (req, res) => {
    const carts = loadCarts();
    const id = String(carts.length ? Math.max(...carts.map(c => parseInt(c.id))) + 1 : 1);
    const newCart = { id, products: [] };
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});

// Listar os produtos do carrinho
router.get('/:cid', (req, res) => {
    const carts = loadCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' });
    res.json(cart.products);
});

// Adicionar produto ao carrinho
router.post('/:cid/product/:pid', (req, res) => {
    const carts = loadCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' });

    const productId = req.params.pid;
    const productInCart = cart.products.find(p => p.product === productId);

    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({ product: productId, quantity: 1 });
    }
    saveCarts(carts);
    res.status(201).json(cart);
});

module.exports = router;
