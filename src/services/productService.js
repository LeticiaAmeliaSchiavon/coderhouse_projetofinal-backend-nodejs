const Product = require("../models/Product");
const mailService = require("./mailService");

module.exports = {
  async deleteProduct(productId, user) {
    const product = await Product.findById(productId);

    if (!product) throw new Error("Product not found");

    if (
      user.role !== "admin" &&
      product.owner.toString() !== user._id.toString()
    ) {
      throw new Error("Unauthorized");
    }

    await Product.findByIdAndDelete(productId);

    if (user.role === "premium") {
      await mailService.sendProductDeletionEmail(
        user.email,
        user.name,
        product.title
      );
    }

    return product;
  },
};
