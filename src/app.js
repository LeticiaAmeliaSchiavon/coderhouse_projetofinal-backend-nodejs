require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productsRouter = require('./routes/products'); // Caminho relativo
const cartsRouter = require('./routes/carts');       // Caminho relativo

const app = express();
const PORT = process.env.PORT || 8080;

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});