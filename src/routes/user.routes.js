const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAdmin } = require("../middlewares/authMiddleware");

// Remove usuários inativos
router.delete("/inactive", isAdmin, async (req, res) => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const inactiveUsers = await User.find({
    lastLogin: { $lt: twoDaysAgo },
    role: { $ne: "admin" }, // Não remove admins
  });

  await User.deleteMany({ _id: { $in: inactiveUsers.map((u) => u._id) } });

  // Envia e-mails (opcional)
  const mailService = require("../services/emailService");

  res.json({ deletedUsers: inactiveUsers.length });
});

module.exports = router;
