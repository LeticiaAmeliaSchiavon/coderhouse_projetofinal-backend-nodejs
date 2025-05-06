const express = require("express");
const passport = require("passport");
const router = express.Router();

// Início do login com GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Callback do GitHub
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Autenticação com sucesso
    res.redirect("/perfil");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
