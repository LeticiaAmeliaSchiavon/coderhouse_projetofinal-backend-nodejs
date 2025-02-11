const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Ticket = require('../models/Ticket');
const { isUser } = require('../middlewares/authMiddleware');

// Finalizar compra
router.post('/:cid/purchase', isUser, async (req, res) => {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    const productsNotPurchased = [];

    for (const item of cart.products) {
        const product = await Product.findById(item.product._id);
        if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
        } else {
            productsNotPurchased.push(item.product._id);
        }
    }

    const ticket = new Ticket({
        code: generateUniqueCode(), 
        amount: calculateTotal(cart), 
        purchaser: req.user.email,
    });

    await ticket.save();

    // Atualize o carrinho com os produtos não comprados
    cart.products = cart.products.filter(item => productsNotPurchased.includes(item.product._id));
    await cart.save();

    res.json({ ticket, productsNotPurchased });
});

module.exports = router;