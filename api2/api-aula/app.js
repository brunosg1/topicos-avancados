var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config(); // Já está aí, ótimo!

// NOVIDADE: Importar o pacote cors
var cors = require('cors'); //

// Importar o express-graphql e o schema GraphQL
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/graphql'); // Importa o schema GraphQL que você criou

const app = express();

// Criar a conexão com o MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado ao MongoDB!"))
  .catch((err) => console.log("Falha ao conectar ao MongoDB:", err));

// ******************************************************
// NOVIDADE: Configurar o CORS AQUI
// ******************************************************

// Opção 1: Permitir todas as origens (mais simples para desenvolvimento)
app.use(cors()); //

// Opção 2: Permitir origens específicas (mais seguro, recomendado para produção)
/*
app.use(cors({
  origin: 'http://localhost:5173', // Substitua pela URL exata do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true // Permite o envio de cookies de credenciais (se necessário)
}));
*/

// ******************************************************

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas REST existentes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Adicionar o endpoint GraphQL
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true, // Habilita a interface GraphiQL
}));

module.exports = app;