const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Ticket = require("../models/Ticket");
const logger = require("../utils/logger");
const cartService = require("./cartService");

module.exports = {
  async processCheckout(cartId, user) {
    const cart = await cartService.getCartById(cartId);

    await cartService.updateCartAfterPurchase(cartId, remainingProducts);

    try {
      // 1. Validação inicial
      if (!cartId || !user?.email) {
        throw new Error("Dados inválidos para checkout");
      }

      // 2. Carrega o carrinho
      const cart = await Cart.findById(cartId).populate({
        path: "products.product",
        model: "Product",
      });

      if (!cart) {
        throw new Error("Carrinho não encontrado");
      }

      // 3. Processa cada item
      const productsNotPurchased = [];
      let total = 0;
      const purchasedItems = [];

      for (const item of cart.products) {
        const product = item.product;

        if (!product) {
          logger.warn(`Produto ${item.product._id} não encontrado`);
          productsNotPurchased.push(item.product._id);
          continue;
        }

        if (product.stock >= item.quantity) {
          // Atualiza o estoque de forma segura
          const updatedProduct = await Product.findOneAndUpdate(
            { _id: product._id, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { new: true }
          );

          if (updatedProduct) {
            total += product.price * item.quantity;
            purchasedItems.push({
              product: product._id,
              quantity: item.quantity,
              price: product.price,
            });
          } else {
            productsNotPurchased.push(product._id);
          }
        } else {
          productsNotPurchased.push(product._id);
        }
      }

      // 4. Cria o ticket apenas se houver itens comprados
      if (purchasedItems.length === 0) {
        throw new Error("Nenhum item disponível para compra");
      }

      const ticket = await Ticket.create({
        code: `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        amount: total,
        purchaser: user.email,
        products: purchasedItems,
      });

      // 5. Atualiza o carrinho (apenas com itens não comprados)
      await Cart.findByIdAndUpdate(cartId, {
        products: cart.products.filter((item) =>
          productsNotPurchased.includes(item.product._id)
        ),
      });
      return {
        ticket,
        productsNotPurchased,
        purchasedItems: purchasedItems.map((item) => item.product),
      };
    } catch (error) {
      logger.error(`Erro no checkout: ${error.message}`, { cartId, user });
      throw error;
    }
  },
};
