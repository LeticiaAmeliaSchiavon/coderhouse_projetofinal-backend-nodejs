const express = require("express");
const router = express.Router();
const { isUser } = require("../middlewares/authMiddleware");
const cartsController = require("../controllers/cartsController");
const checkoutService = require("../services/checkoutService");

// Finalizar compra (usando o service)
router.post("/:cid/purchase", isUser, async (req, res) => {
  try {
    const result = await checkoutService.processCheckout(
      req.params.cid,
      req.user
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Visualização do carrinho
router.get("/view", cartsController.renderCartView);

// Finalização da compra (página)
router.get("/checkout", cartsController.renderCheckout);

// Confirmação
router.get("/confirmation/:ticketId", cartsController.renderConfirmation);

module.exports = router;
