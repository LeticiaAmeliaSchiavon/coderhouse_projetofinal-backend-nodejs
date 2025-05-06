const Product = require("../models/Product");
const User = require("../models/User");
const mailService = require("../services/emailService");

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const productOwner = await User.findOne({ _id: product.owner });
    const isPremiumProduct = productOwner && productOwner.role === "premium";

    await Product.findByIdAndDelete(req.params.pid);

    if (isPremiumProduct) {
      await mailService.sendProductDeletionEmail(
        productOwner.email,
        productOwner.name,
        product.title
      );
    }

    res.json({
      success: true,
      message: isPremiumProduct
        ? "Produto excluído e notificação enviada"
        : "Produto excluído",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
