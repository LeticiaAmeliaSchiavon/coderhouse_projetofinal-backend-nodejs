const User = require("../models/User");
const bcrypt = require("bcrypt");

// Cadastro de novo usuário
exports.register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Validações básicas
    if (!name || !email || !password || !confirmPassword) {
      return res.render("register", { error: "Preencha todos os campos." });
    }

    if (password !== confirmPassword) {
      return res.render("register", { error: "As senhas não coincidem." });
    }

    // Verifica se o e-mail já está cadastrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", { error: "Este e-mail já está em uso." });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria e salva o novo usuário
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // padrão
    });

    await newUser.save();

    // Redireciona para login após cadastro
    res.redirect("/login");
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).render("register", { error: "Erro no servidor." });
  }
};

// Login local
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca o usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { error: "E-mail não encontrado." });
    }

    // Compara a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: "Senha incorreta." });
    }

    // Cria a sessão
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Atualiza o lastLogin
    user.lastLogin = new Date();
    await user.save();

    res.redirect("/perfil");
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).render("login", { error: "Erro no servidor." });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
