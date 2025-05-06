const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  // Verifica se é admin
  isAdmin: async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user || user.role !== "admin") throw new Error();
      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({ error: "Acesso negado" });
    }
  },

  // Verifica se é premium ou admin
  isPremiumOrAdmin: (req, res, next) => {
    if (req.user.role === "premium" || req.user.role === "admin") next();
    else res.status(403).json({ error: "Acesso restrito" });
  },
};
