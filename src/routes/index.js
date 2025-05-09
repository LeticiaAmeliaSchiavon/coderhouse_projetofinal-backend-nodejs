const express = require("express");
const router = express.Router();

router.use("/api/products", productRoutes);
router.use("/api/carts", cartRoutes);
router.use("/api/users", userRoutes);
router.use("/auth", sessionRoutes); // GitHub
router.use("/", authRoutes); // Login, Register, Logout locais
router.use("/", viewRoutes); // Páginas de visualização

module.exports = router;
