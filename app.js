const express = require('express');
const app = express();
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Configuração do Handlebars
const { engine } = require('express-handlebars');
app.engine('handlebars', engine()); 
app.set('view engine', 'handlebars');
app.set('views', './views');

// Configuração do Mongoose
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce')
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});