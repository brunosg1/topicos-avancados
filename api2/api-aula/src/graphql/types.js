const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
} = require('graphql');

// Tipo de Ocorrência
const OccurrenceType = new GraphQLObjectType({
  name: 'Occurrence',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) }, // ID é obrigatório e será o _id do MongoDB
    name: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }, 
    location: { type: new GraphQLNonNull(GraphQLString) },
    dateReported: { type: new GraphQLNonNull(GraphQLString) }, 
    severity: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// Tipo de Input para criação de Ocorrência (não inclui 'id' e 'dateReported' automático)
const OccurrenceInputType = new GraphQLInputObjectType({
  name: 'OccurrenceInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    location: { type: new GraphQLNonNull(GraphQLString) },
    severity: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Tipo de Input para atualização de Ocorrência (todos os campos são opcionais, exceto ID)
const OccurrenceUpdateInputType = new GraphQLInputObjectType({
  name: 'OccurrenceUpdateInput',
  fields: {
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    description: { type: GraphQLString },
    location: { type: GraphQLString },
    severity: { type: GraphQLString },
  },
});

module.exports = {
  OccurrenceType,
  OccurrenceInputType,
  OccurrenceUpdateInputType,
};