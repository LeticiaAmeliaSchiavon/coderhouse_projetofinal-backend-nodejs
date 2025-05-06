const Cart = require("../models/Cart");
const Ticket = require("../models/Ticket");
const checkoutService = require("../services/checkoutService");
const logger = require("../utils/logger");

const getCart = async (cartId) => {
  const cart = await Cart.findById(cartId).populate({
    path: "products.product",
    select: "name price stock",
  });

  if (!cart) throw new Error("Carrinho não encontrado");
  return cart;
};

exports.renderCartView = async (req, res) => {
  try {
    if (!req.user?.cartId) throw new Error("Usuário não possui carrinho");

    const cart = await getCart(req.user.cartId);
    const validProducts = cart.products.filter((item) => item.product);

    res.render("cart", {
      products: validProducts,
      total: validProducts.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    });
  } catch (error) {
    logger.error(`Erro ao renderizar carrinho: ${error.message}`, {
      userId: req.user?._id,
    });
    res.status(500).render("error", {
      error: "Erro no carrinho",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

exports.renderCheckout = (req, res) => {
  try {
    res.render("checkout", {
      cartId: req.user.cartId,
    });
  } catch (error) {
    logger.error(`Erro no checkout: ${error.message}`);
    res.status(500).redirect("/cart/view");
  }
};

exports.processCheckout = async (req, res) => {
  try {
    if (!req.user?.cartId) throw new Error("Carrinho não encontrado");

    const { ticket, productsNotPurchased } =
      await checkoutService.processCheckout(req.user.cartId, req.user);

    logger.info(`Checkout concluído para carrinho ${req.user.cartId}`);

    res.redirect(
      `/carts/confirmation/${
        ticket._id
      }?unavailable=${productsNotPurchased.join(",")}`
    );
  } catch (error) {
    logger.error(`Falha no checkout: ${error.message}`, {
      cartId: req.user?.cartId,
    });

    res.status(400).render("checkout", {
      error: "Falha no processamento",
      details: process.env.NODE_ENV === "development" ? error.message : null,
      cartId: req.user.cartId,
    });
  }
};

exports.renderConfirmation = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate(
      "products.product",
      "name price"
    );

    if (!ticket) throw new Error("Ticket inválido");

    res.render("confirmation", {
      ticket,
      unavailableItems: req.query.unavailable?.split(",") || [],
    });
  } catch (error) {
    logger.error(`Erro na confirmação: ${error.message}`, {
      ticketId: req.params.ticketId,
    });

    res.status(404).render("error", {
      error: "Ticket não encontrado",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};
