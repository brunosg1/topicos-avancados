import axios from "axios";
import { AuthService } from '../services/authService';

const API_BASE = "http://localhost:8080";
const API_BASE_AUTH = "http://localhost:8080/auth";
const API2 = "http://localhost:8080/auth";

export const api = axios.create({ baseURL: API_BASE });
export const api_auth = axios.create({ baseURL: API_BASE_AUTH });

api.interceptors.request.use((config) => {
  console.log('Token via AuthService:', AuthService.getToken());
  
  config.headers.Authorization = `Bearer ${AuthService.getToken()}`;
  return config;
});

export const cadastrarPropriedade = (data) => api.post("/propriedades", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const cadastrarCultura = (data) => api.post("/culturas", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const cadastrarTipoPraga = (data) => api.post("/pragas", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const cadastrarTipoDoenca = (data) => api.post("/doencas", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const registrarOcorrencia = (data) => api.post("/ocorrencias", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const listarOcorrencias = () => api.get("/ocorrencias", {
    headers: {
      'Content-Type': 'application/json'
    }
  });
export const Login = (data) => api_auth.post("/login", data);



// services/api.js - Funções GET para monitoramento

// Headers padrão
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Função auxiliar para fazer requisições GET
const makeGetRequest = async (endpoint) => {
  try {
    
    console.log("buscando dados de... ", endpoint);
    const response = await api.get(endpoint); // 'await' aqui é crucial
    const data = response.data; // Acesse a propriedade 'data' da resposta

    console.log(data);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar dados de ${endpoint}:`, error);
    throw error;
  }
};

// ===== FUNÇÕES GET PARA PROPRIEDADES =====

// Buscar todas as propriedades
export const obterPropriedades = async () => {
  return await makeGetRequest('/propriedades');
};

// Buscar propriedade por ID
export const obterPropriedadePorId = async (id) => {
  return await makeGetRequest(`/propriedades/${id}`);
};

// Buscar propriedades por responsável
export const obterPropriedadesPorResponsavel = async (responsavel) => {
  return await makeGetRequest(`/propriedades/responsavel/${encodeURIComponent(responsavel)}`);
};

// ===== FUNÇÕES GET PARA CULTURAS =====

// Buscar todas as culturas
export const obterCulturas = async () => {
  return await makeGetRequest('/culturas');
};

// Buscar cultura por ID
export const obterCulturaPorId = async (id) => {
  return await makeGetRequest(`/culturas/${id}`);
};

// Buscar culturas por época de plantio
export const obterCulturasPorEpoca = async (epoca) => {
  return await makeGetRequest(`/culturas/epoca/${encodeURIComponent(epoca)}`);
};

// Buscar culturas por tempo de cultivo (range)
export const obterCulturasPorTempo = async (tempoMin, tempoMax) => {
  return await makeGetRequest(`/culturas/tempo/${tempoMin}/${tempoMax}`);
};

// ===== FUNÇÕES GET PARA PRAGAS =====

// Buscar todas as pragas
export const obterPragas = async () => {
  return await makeGetRequest('/pragas');
};

// Buscar praga por ID
export const obterPragaPorId = async (id) => {
  return await makeGetRequest(`/pragas/${id}`);
};

// Buscar pragas por nome científico
export const obterPragaPorNomeCientifico = async (nomeCientifico) => {
  return await makeGetRequest(`/pragas/cientifico/${encodeURIComponent(nomeCientifico)}`);
};

// Buscar pragas que afetam uma cultura específica
export const obterPragasPorCultura = async (cultura) => {
  return await makeGetRequest(`/pragas/cultura/${encodeURIComponent(cultura)}`);
};

// ===== FUNÇÕES GET PARA DOENÇAS =====

// Buscar todas as doenças
export const obterDoencas = async () => {
  return await makeGetRequest('/doencas');
};

// Buscar doença por ID
export const obterDoencaPorId = async (id) => {
  return await makeGetRequest(`/doencas/${id}`);
};

// Buscar doenças por sintoma
export const obterDoencasPorSintoma = async (sintoma) => {
  return await makeGetRequest(`/doencas/sintoma/${encodeURIComponent(sintoma)}`);
};

// Buscar doenças que afetam uma cultura específica
export const obterDoencasPorCultura = async (cultura) => {
  return await makeGetRequest(`/doencas/cultura/${encodeURIComponent(cultura)}`);
};

// Buscar doenças por tratamento
export const obterDoencasPorTratamento = async (tratamento) => {
  return await makeGetRequest(`/doencas/tratamento/${encodeURIComponent(tratamento)}`);
};

// ===== FUNÇÕES GET PARA OCORRÊNCIAS (se aplicável) =====

// Buscar todas as ocorrências
export const obterOcorrencias = async () => {
  return await makeGetRequest('/ocorrencias');
};

// Buscar ocorrência por ID
export const obterOcorrenciaPorId = async (id) => {
  return await makeGetRequest(`/ocorrencias/${id}`);
};

// Buscar ocorrências por propriedade
export const obterOcorrenciasPorPropriedade = async (propriedadeId) => {
  return await makeGetRequest(`/ocorrencias/propriedade/${propriedadeId}`);
};

// Buscar ocorrências por tipo (praga ou doença)
export const obterOcorrenciasPorTipo = async (tipo) => {
  return await makeGetRequest(`/ocorrencias/tipo/${tipo}`);
};

// Buscar ocorrências por data
export const obterOcorrenciasPorData = async (dataInicio, dataFim) => {
  return await makeGetRequest(`/ocorrencias/data/${dataInicio}/${dataFim}`);
};

// ===== FUNÇÕES PARA RELATÓRIOS E ESTATÍSTICAS =====

// Obter resumo geral do sistema
export const obterResumoGeral = async () => {
  return await makeGetRequest('/relatorios/resumo');
};

// Obter estatísticas de propriedades
export const obterEstatisticasPropriedades = async () => {
  return await makeGetRequest('/relatorios/propriedades/estatisticas');
};

// Obter estatísticas de culturas
export const obterEstatisticasCulturas = async () => {
  return await makeGetRequest('/relatorios/culturas/estatisticas');
};

// Obter relatório de pragas mais comuns
export const obterPragasMaisComuns = async () => {
  return await makeGetRequest('/relatorios/pragas/mais-comuns');
};

// Obter relatório de doenças mais comuns
export const obterDoencasMaisComuns = async () => {
  return await makeGetRequest('/relatorios/doencas/mais-comuns');
};

// ===== FUNÇÕES DE BUSCA AVANÇADA =====

// Busca geral (busca em todos os tipos de dados)
export const buscarGeral = async (termo) => {
  return await makeGetRequest(`/busca/geral?q=${encodeURIComponent(termo)}`);
};

// Buscar por filtros múltiplos
export const buscarComFiltros = async (filtros) => {
  const queryParams = new URLSearchParams(filtros).toString();
  return await makeGetRequest(`/busca/filtros?${queryParams}`);
};

// ===== FUNÇÕES PARA MONITORAMENTO EM TEMPO REAL =====

// Obter dados de monitoramento de uma propriedade
export const obterMonitoramentoPropriedade = async (propriedadeId) => {
  return await makeGetRequest(`/monitoramento/propriedade/${propriedadeId}`);
};

// Obter alertas ativos
export const obterAlertasAtivos = async () => {
  return await makeGetRequest('/monitoramento/alertas/ativos');
};

// Obter histórico de monitoramento
export const obterHistoricoMonitoramento = async (propriedadeId, periodo) => {
  return await makeGetRequest(`/monitoramento/historico/${propriedadeId}/${periodo}`);
};

// ===== EXEMPLO DE USO =====

/*
// Como usar essas funções em seus componentes:

import { 
  obterPropriedades, 
  obterCulturas, 
  obterPragas, 
  obterDoencas,
  obterResumoGeral 
} from '../services/api.js';

// Em um componente React:
const MonitoramentoPage = () => {
  const [dados, setDados] = useState({
    propriedades: [],
    culturas: [],
    pragas: [],
    doencas: [],
    resumo: {}
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [propriedades, culturas, pragas, doencas, resumo] = await Promise.all([
          obterPropriedades(),
          obterCulturas(),
          obterPragas(),
          obterDoencas(),
          obterResumoGeral()
        ]);

        setDados({
          propriedades,
          culturas,
          pragas,
          doencas,
          resumo
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  return (
    // Seu JSX aqui
  );
};
*/