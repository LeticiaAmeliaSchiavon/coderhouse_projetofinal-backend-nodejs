const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Função para ler os carrinhos do arquivo
const readCarts = () => {
    const data = fs.readFileSync(cartsFilePath, 'utf-8');
    return JSON.parse(data);
};

// Função para escrever os carrinhos no arquivo
const writeCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Criar um novo carrinho
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: (carts.length + 1).toString(), // Gera um ID simples
        products: []
    };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// Listar produtos de um carrinho com populate
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrinho não encontrado' });
        res.json({ status: 'success', payload: cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Adicionar produto ao carrinho
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrinho não encontrado' });

        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Produto não encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += req.body.quantity || 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: req.body.quantity || 1 });
        }

        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Atualizar carrinho com array de produtos
router.put('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products: req.body.products },
            { new: true }
        );
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrinho não encontrado' });
        res.json({ status: 'success', payload: cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Remover todos os produtos do carrinho
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products: [] },
            { new: true }
        );
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrinho não encontrado' });
        res.json({ status: 'success', payload: cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;