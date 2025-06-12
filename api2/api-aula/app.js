var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config(); // Já está aí, ótimo!

// Importar o express-graphql e o schema GraphQL
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/graphql'); // Importa o schema GraphQL que você criou

const app = express();

// Criar a conexão com o MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado ao MongoDB!"))
  .catch((err) => console.log("Falha ao conectar ao MongoDB:", err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas REST existentes (você pode mantê-las ou remover se sua API for puramente GraphQL)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);

// ******************************************************
// Adicionar o endpoint GraphQL
// ******************************************************
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true, // Habilita a interface GraphiQL para testar suas queries e mutations
}));

// ******************************************************

module.exports = app;