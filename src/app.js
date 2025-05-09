require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const connectDB = require("./config/connectDB");
const session = require("express-session");
const passport = require("./config/passport");

// Conecta ao MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (pasta public)
app.use(express.static(path.join(__dirname, "public")));

// Configuração do Handlebars com helpers
app.engine(
  "handlebars",
  exphbs.engine({
    helpers: {
      formatDate: require("./utils/helpers").formatDate,
      eq: (a, b) => a === b,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Sessões
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Rotas de views
app.get("/", (req, res) => res.render("home"));
app.get("/perfil", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  res.render("perfil", { user: req.user });
});
app.get("/login", (req, res) => res.render("login"));
app.get("/admin", (req, res) => res.render("admin"));

// Rotas de API
app.use("/api/products", require("./routes/product.routes"));

// Página 404
app.use((req, res) => {
  res.status(404).render("404");
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
