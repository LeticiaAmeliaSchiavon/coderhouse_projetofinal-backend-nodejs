const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Registro
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("login", {
        error: "Usuário já registrado. Faça login.",
      });
    }

    // Cria novo usuário
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.redirect("/login");
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).render("login", { error: "Erro ao registrar." });
  }
});

// Login local
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res
        .status(400)
        .render("login", { error: "Credenciais inválidas." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .render("login", { error: "Credenciais inválidas." });
    }

    req.login(user, (err) => {
      if (err) throw err;
      res.redirect("/perfil");
    });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).render("login", { error: "Erro no login." });
  }
});

module.exports = router;
