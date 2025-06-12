const {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const { OccurrenceType } = require('./types');
const Occurrence = require('../models/Occurrence'); 

const OccurrenceQueries = {
  allOccurrences: {
    // ATENÇÃO: Adicione 'new' aqui!
    type: new GraphQLList(OccurrenceType),
    resolve(parent, args) {
      return Occurrence.find({});
    },
  },
  // Query para buscar uma ocorrência por ID
  occurrence: {
    type: OccurrenceType, // OccurrenceType já é uma instância de GraphQLObjectType, então não precisa de 'new' aqui.
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(parent, args) {
      return Occurrence.findById(args.id);
    },
  },
};

module.exports = OccurrenceQueries;