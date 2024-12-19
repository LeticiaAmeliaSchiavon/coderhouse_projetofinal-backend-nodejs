const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const { initializePassport } = require('./config/passport.config');
const authRouter = require('./routes/auth.routes');
const productsRouter = require('./routes/products.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Definir a opção strictQuery para se preparar para a mudança no Mongoose 7
mongoose.set('strictQuery', true);

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Conectado ao MongoDB!');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
  process.exit(1);
});

// Configuração de sessões
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/auth', authRouter);
app.use('/api/products', productsRouter);

// Rota de redirecionamento após login
app.get('/products', (req, res) => res.redirect('/api/products/view'));

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
