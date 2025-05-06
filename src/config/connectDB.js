const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ecommerce", // ← opcional: define o nome do banco
    });
    console.log("✅ Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1); // Encerra o app em caso de erro
  }

  if (!process.env.MONGODB_URI) {
    console.error("❌ Variável MONGODB_URI não encontrada no .env");
    process.exit(1);
  }
};

module.exports = connectDB;
