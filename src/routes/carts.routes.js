const express = require('express');
const router = express.Router();
const Cart = require('../dao/models/cart.model');
const Product = require('../dao/models/product.model');

// POST /api/carts/
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) {
      return res.status(404).send('Carrinho não encontrado');
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/carts/:cid/view
router.get('/:cid/view', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) {
      return res.status(404).send('Carrinho não encontrado');
    }
    res.render('cart', { products: cart.products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).send('Carrinho não encontrado');
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findByIdAndDelete(cid);
    if (!cart) {
      return res.status(404).send('Carrinho não encontrado');
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    if (!cart) {
      return res.status(404).send('Carrinho não encontrado');
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).send('Carrinho não encontrado');
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).send('Produto não encontrado no carrinho');
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
