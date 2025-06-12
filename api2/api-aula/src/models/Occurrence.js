const mongoose = require('mongoose');

const occurrenceSchema = new mongoose.Schema({
  // Exemplo de campos para a entidade "Ocorrência de Pragas e Doenças"
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: { // Tipo de ocorrência: 'praga' ou 'doença'
    type: String,
    required: true,
    enum: ['praga', 'doença'], // Garante que só aceitará esses valores
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  location: { // Local da ocorrência (ex: nome da fazenda, coordenadas, etc.)
    type: String,
    required: true,
    trim: true,
  },
  dateReported: { // Data em que a ocorrência foi relatada
    type: Date,
    default: Date.now,
  },
  severity: { // Nível de gravidade (ex: 'baixa', 'média', 'alta')
    type: String,
    required: true,
    enum: ['baixa', 'media', 'alta'],
  },
  // Você pode adicionar mais campos conforme a necessidade
  // affectedCrops: [{ type: String }], // Exemplo: culturas afetadas
  // suggestedTreatment: { type: String }, // Exemplo: tratamento sugerido
});

module.exports = mongoose.model('Occurrence', occurrenceSchema);