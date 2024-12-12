const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB!');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
  process.exit(1);
});

// Configurar Handlebars como motor de templates
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Redirecionar para as views de produtos e carrinhos
app.get('/products', (req, res) => res.redirect('/api/products/view'));
app.get('/carts/:cid', (req, res) => res.redirect(`/api/carts/${req.params.cid}/view`));

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
