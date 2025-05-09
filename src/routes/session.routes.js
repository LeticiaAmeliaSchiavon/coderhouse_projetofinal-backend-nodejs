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
    // Login com sucesso via GitHub
    res.redirect("/perfil");
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/login");
  });
});

module.exports = router;
