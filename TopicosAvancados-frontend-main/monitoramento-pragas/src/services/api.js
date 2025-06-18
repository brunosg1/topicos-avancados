import axios from "axios";
import { AuthService } from '../services/authService'; //

const API_BASE = "http://localhost:8080"; //
const API_BASE_AUTH = "http://localhost:8080/auth"; //

// CORREÇÃO AQUI: API2 deve ser uma instância do axios.
const API_BASE_GRAPHQL = "http://localhost:3000"; // A base URL para sua API GraphQL
export const API2 = axios.create({ baseURL: API_BASE_GRAPHQL }); // Agora API2 é uma instância do axios

export const api = axios.create({ baseURL: API_BASE }); //
export const api_auth = axios.create({ baseURL: API_BASE_AUTH }); //

api.interceptors.request.use((config) => { //
  console.log('Token via AuthService:', AuthService.getToken()); //

  config.headers.Authorization = `Bearer ${AuthService.getToken()}`; //
  return config; //
});

export const cadastrarPropriedade = (data) => api.post("/propriedades", data, { headers: { 'Content-Type': 'application/json' } }); //
export const cadastrarCultura = (data) => api.post("/culturas", data, { headers: { 'Content-Type': 'application/json' } }); //
export const cadastrarTipoPraga = (data) => api.post("/pragas", data, { headers: { 'Content-Type': 'application/json' } }); //
export const cadastrarTipoDoenca = (data) => api.post("/doencas", data, { headers: { 'Content-Type': 'application/json' } }); //

export const deletarDoenca = (id) => api.delete(`/doencas/${id}`, { headers: { 'Content-Type': 'application/json' } }); //
export const deletarPraga = (id) => api.delete(`/pragas/${id}`, { headers: { 'Content-Type': 'application/json' } }); //
export const deletarCultura = (id) => api.delete(`/culturas/${id}`, { headers: { 'Content-Type': 'application/json' } }); //
export const deletarPropriedade = (id) => api.delete(`/propriedades/${id}`, { headers: { 'Content-Type': 'application/json' } }); //

export const editarPropriedade = (data) => api.put("/propriedades", data, { headers: { 'Content-Type': 'application/json' } }); //
export const editarCultura = (data) => api.put("/culturas", data, { headers: { 'Content-Type': 'application/json' } }); //
export const editarTipoPraga = (data) => api.put("/pragas", data, { headers: { 'Content-Type': 'application/json' } }); //
export const editarTipoDoenca = (data) => api.put("/doencas", data, { headers: { 'Content-Type': 'application/json' } }); //

export const registrarOcorrencia = (data) => api.post("/ocorrencias", data, { headers: { 'Content-Type': 'application/json' } }); //
export const listarOcorrencias = () => api.get("/ocorrencias", { headers: { 'Content-Type': 'application/json' } }); //
export const Login = (data) => api_auth.post("/login", data); //

// --- MÉTODOS PARA QUERIES (BUSCA DE DADOS) ---

export const getAllOccurrences = async () => { //
  const query = `
    query {
      allOccurrences {
        id
        name
        type
        description
        location
        dateReported
        severity
      }
    }
  `; //

  try {
    // Agora API2.post funcionará
    const response = await API2.post( //
      "/graphql", //
      { query }, //
      { headers: { 'Content-Type': 'application/json' } } //
    );
    // As respostas GraphQL vêm dentro de response.data.data
    return response.data.data.allOccurrences; //
  } catch (error) {
    console.error("Erro ao buscar todas as ocorrências:", error); //
    throw error; // Rejeita o erro para ser tratado no componente que chamar //
  }
};

export const getOccurrenceById = async (id) => { //
  const query = `
    query GetOccurrenceById($id: ID!) {
      occurrence(id: $id) {
        id
        name
        type
        description
        location
        dateReported
        severity
      }
    }
  `; //

  const variables = { id }; //

  try {
    const response = await API2.post( //
      "/graphql", //
      { query, variables }, //
      { headers: { 'Content-Type': 'application/json' } } //
    );
    return response.data.data.occurrence; //
  } catch (error) {
    console.error(`Erro ao buscar ocorrência com ID ${id}:`, error); //
    throw error; //
  }
};

// --- MÉTODOS PARA MUTATIONS (MODIFICAÇÃO DE DADOS) ---

export const createOccurrence = async (input) => { //
  const mutation = `
    mutation AddNewOccurrence($input: OccurrenceInput!) {
      addOccurrence(input: $input) {
        id
        name
        type
        description
        location
        dateReported
        severity
      }
    }
  `; //

  const variables = { input }; //

  try {
    const response = await API2.post( //
      "/graphql", //
      { query: mutation, variables }, // Note: usamos 'query' mesmo para mutations no objeto //
      { headers: { 'Content-Type': 'application/json' } } //
    );
    return response.data.data.addOccurrence; //
  } catch (error) {
    console.error("Erro ao criar ocorrência:", error); //
    throw error; //
  }
};

export const updateOccurrence = async (id, input) => { //
  const mutation = `
    mutation UpdateExistingOccurrence($id: ID!, $input: OccurrenceUpdateInput!) {
      updateOccurrence(id: $id, input: $input) {
        id
        name
        type
        description
        location
        dateReported
        severity
      }
    }
  `; //

  const variables = { id, input }; //

  try {
    const response = await API2.post( //
      "/graphql", //
      { query: mutation, variables }, //
      { headers: { 'Content-Type': 'application/json' } } //
    );
    return response.data.data.updateOccurrence; //
  } catch (error) {
    console.error(`Erro ao atualizar ocorrência com ID ${id}:`, error); //
    throw error; //
  }
};

export const deleteOccurrence = async (id) => { //
  const mutation = `
    mutation DeleteSingleOccurrence($id: ID!) {
      deleteOccurrence(id: $id) {
        id # Você pode pedir o ID do item deletado de volta, ou apenas uma mensagem
        name
      }
    }
  `; //

  const variables = { id }; //

  try {
    const response = await API2.post( //
      "/graphql", //
      { query: mutation, variables }, //
      { headers: { 'Content-Type': 'application/json' } } //
    );
    // Dependendo do que seu resolver de delete retorna, ajuste aqui
    // Se retorna um objeto Occurrence: response.data.data.deleteOccurrence
    // Se retorna uma string de sucesso: response.data.data.deleteOccurrence
    return response.data.data.deleteOccurrence; //
  } catch (error) {
    console.error(`Erro ao deletar ocorrência com ID ${id}:`, error); //
    throw error; //
  }
};

// Função auxiliar para fazer requisições GET
const makeGetRequest = async (endpoint) => { //
  try {

    console.log("buscando dados de... ", endpoint); //
    const response = await api.get(endpoint); // 'await' aqui é crucial //
    const data = response.data; // Acesse a propriedade 'data' da resposta //

    console.log(data); //
    return data; //
  } catch (error) {
    console.error(`Erro ao buscar dados de ${endpoint}:`, error); //
    throw error; //
  }
};

// ===== FUNÇÕES GET PARA PROPRIEDADES =====

// Buscar todas as propriedades
export const obterPropriedades = async () => { //
  return await makeGetRequest('/propriedades'); //
};

// Buscar propriedade por ID
export const obterPropriedadePorId = async (id) => { //
  return await makeGetRequest(`/propriedades/${id}`); //
};

// Buscar propriedades por responsável
export const obterPropriedadesPorResponsavel = async (responsavel) => { //
  return await makeGetRequest(`/propriedades/responsavel/${encodeURIComponent(responsavel)}`); //
};

// ===== FUNÇÕES GET PARA CULTURAS =====

// Buscar todas as culturas
export const obterCulturas = async () => { //
  return await makeGetRequest('/culturas'); //
};

// Buscar cultura por ID
export const obterCulturaPorId = async (id) => { //
  return await makeGetRequest(`/culturas/${id}`); //
};

// Buscar culturas por época de plantio
export const obterCulturasPorEpoca = async (epoca) => { //
  return await makeGetRequest(`/culturas/epoca/${encodeURIComponent(epoca)}`); //
};

// Buscar culturas por tempo de cultivo (range)
export const obterCulturasPorTempo = async (tempoMin, tempoMax) => { //
  return await makeGetRequest(`/culturas/tempo/${tempoMin}/${tempoMax}`); //
};

// ===== FUNÇÕES GET PARA PRAGAS =====

// Buscar todas as pragas
export const obterPragas = async () => { //
  return await makeGetRequest('/pragas'); //
};

// Buscar praga por ID
export const obterPragaPorId = async (id) => { //
  return await makeGetRequest(`/pragas/${id}`); //
};

// Buscar pragas por nome científico
export const obterPragaPorNomeCientifico = async (nomeCientifico) => { //
  return await makeGetRequest(`/pragas/cientifico/${encodeURIComponent(nomeCientifico)}`); //
};

// Buscar pragas que afetam uma cultura específica
export const obterPragasPorCultura = async (cultura) => { //
  return await makeGetRequest(`/pragas/cultura/${encodeURIComponent(cultura)}`); //
};

// ===== FUNÇÕES GET PARA DOENÇAS =====

// Buscar todas as doenças
export const obterDoencas = async () => { //
  return await makeGetRequest('/doencas'); //
};

// Buscar doença por ID
export const obterDoencaPorId = async (id) => { //
  return await makeGetRequest(`/doencas/${id}`); //
};

// Buscar doenças por sintoma
export const obterDoencasPorSintoma = async (sintoma) => { //
  return await makeGetRequest(`/doencas/sintoma/${encodeURIComponent(sintoma)}`); //
};

// Buscar doenças que afetam uma cultura específica
export const obterDoencasPorCultura = async (cultura) => { //
  return await makeGetRequest(`/doencas/cultura/${encodeURIComponent(cultura)}`); //
};

// Buscar doenças por tratamento
export const obterDoencasPorTratamento = async (tratamento) => { //
  return await makeGetRequest(`/doencas/tratamento/${encodeURIComponent(tratamento)}`); //
};

// ===== FUNÇÕES GET PARA OCORRÊNCIAS (se aplicável) =====

// Buscar todas as ocorrências
export const obterOcorrencias = async () => { //
  return await makeGetRequest('/ocorrencias'); //
};

// Buscar ocorrência por ID
export const obterOcorrenciaPorId = async (id) => { //
  return await makeGetRequest(`/ocorrencias/${id}`); //
};

// Buscar ocorrências por propriedade
export const obterOcorrenciasPorPropriedade = async (propriedadeId) => { //
  return await makeGetRequest(`/ocorrencias/propriedade/${propriedadeId}`); //
};

// Buscar ocorrências por tipo (praga ou doença)
export const obterOcorrenciasPorTipo = async (tipo) => { //
  return await makeGetRequest(`/ocorrencias/tipo/${tipo}`); //
};

// Buscar ocorrências por data
export const obterOcorrenciasPorData = async (dataInicio, dataFim) => { //
  return await makeGetRequest(`/ocorrencias/data/${dataInicio}/${dataFim}`); //
};

// ===== FUNÇÕES PARA RELATÓRIOS E ESTATÍSTICAS =====

// Obter resumo geral do sistema
export const obterResumoGeral = async () => { //
  return await makeGetRequest('/relatorios/resumo'); //
};

// Obter estatísticas de propriedades
export const obterEstatisticasPropriedades = async () => { //
  return await makeGetRequest('/relatorios/propriedades/estatisticas'); //
};

// Obter estatísticas de culturas
export const obterEstatisticasCulturas = async () => { //
  return await makeGetRequest('/relatorios/culturas/estatisticas'); //
};

// Obter relatório de pragas mais comuns
export const obterPragasMaisComuns = async () => { //
  return await makeGetRequest('/relatorios/pragas/mais-comuns'); //
};

// Obter relatório de doenças mais comuns
export const obterDoencasMaisComuns = async () => { //
  return await makeGetRequest('/relatorios/doencas/mais-comuns'); //
};

// ===== FUNÇÕES DE BUSCA AVANÇADA =====

// Busca geral (busca em todos os tipos de dados)
export const buscarGeral = async (termo) => { //
  return await makeGetRequest(`/busca/geral?q=${encodeURIComponent(termo)}`); //
};

// Buscar por filtros múltiplos
export const buscarComFiltros = async (filtros) => { //
  const queryParams = new URLSearchParams(filtros).toString(); //
  return await makeGetRequest(`/busca/filtros?${queryParams}`); //
};

// ===== FUNÇÕES PARA MONITORAMENTO EM TEMPO REAL =====

// Obter dados de monitoramento de uma propriedade
export const obterMonitoramentoPropriedade = async (propriedadeId) => { //
  return await makeGetRequest(`/monitoramento/propriedade/${propriedadeId}`); //
};

// Obter alertas ativos
export const obterAlertasAtivos = async () => { //
  return await makeGetRequest('/monitoramento/alertas/ativos'); //
};

// Obter histórico de monitoramento
export const obterHistoricoMonitoramento = async (propriedadeId, periodo) => { //
  return await makeGetRequest(`/monitoramento/historico/${propriedadeId}/${periodo}`); //
};