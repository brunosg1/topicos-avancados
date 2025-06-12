const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString, // Adicionado caso precise, mas geralmente não precisa de 'new'
} = require('graphql');
const { OccurrenceType, OccurrenceInputType, OccurrenceUpdateInputType } = require('./types');
const Occurrence = require('../models/Occurrence'); // Importa o modelo Mongoose

const OccurrenceMutations = {
  // Mutation para adicionar uma nova ocorrência
  addOccurrence: {
    type: OccurrenceType, // OccurrenceType já é uma instância de GraphQLObjectType, não precisa de 'new'
    args: {
      // ATENÇÃO: Adicione 'new' aqui!
      input: { type: new GraphQLNonNull(OccurrenceInputType) },
    },
    async resolve(parent, { input }) {
      const newOccurrence = new Occurrence(input);
      return await newOccurrence.save();
    },
  },
  // Mutation para atualizar uma ocorrência existente
  updateOccurrence: {
    type: OccurrenceType, // Não precisa de 'new'
    args: {
      // ATENÇÃO: Adicione 'new' aqui!
      id: { type: new GraphQLNonNull(GraphQLID) },
      input: { type: new GraphQLNonNull(OccurrenceUpdateInputType) },
    },
    async resolve(parent, { id, input }) {
      return await Occurrence.findByIdAndUpdate(id, input, { new: true }); // new: true retorna o documento atualizado
    },
  },
  // Mutation para deletar uma ocorrência
  deleteOccurrence: {
    type: OccurrenceType, // Não precisa de 'new'
    args: {
      // ATENÇÃO: Adicione 'new' aqui!
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, { id }) {
      return await Occurrence.findByIdAndDelete(id);
    },
  },
};

module.exports = OccurrenceMutations;