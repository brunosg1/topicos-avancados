const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const OccurrenceQueries = require('./queries');
const OccurrenceMutations = require('./mutations');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...OccurrenceQueries, // Adiciona todas as queries de Ocorrência
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    ...OccurrenceMutations, // Adiciona todas as mutations de Ocorrência
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});