const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middlewares/sessionAuth");

// Página inicial
router.get("/", (req, res) => {
  res.render("home", { user: req.user || null });
});

// Página de perfil (somente se logado via sessão)
router.get("/perfil", ensureAuthenticated, (req, res) => {
  res.render("perfil", { user: req.user });
});

// Página de admin (somente admins autenticados via sessão)
router.get("/admin", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    res.render("adminUsers", { user: req.user });
  } else {
    res.status(403).render("403", { layout: false });
  }
});

// Página de login (caso queira uma view de login)
router.get("/login", (req, res) => {
  res.render("login");
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

module.exports = router;
