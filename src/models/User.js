const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Agora requerido
  email: { type: String, required: true, unique: true }, // Agora requerido
  password: { type: String }, // Continua opcional (por causa do GitHub)
  githubId: { type: String }, // Preenchido apenas para login via GitHub
  role: { type: String, enum: ["user", "admin"], default: "user" },
  lastLogin: { type: Date, default: Date.now },
});

// Criptografa a senha antes de salvar
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Método para comparar senha no login local
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
