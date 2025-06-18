import React, { useState, useEffect } from 'react';
import { FaSeedling, FaHome, FaTractor, FaBug, FaEye, FaSearch, FaSync } from "react-icons/fa";
import { Link } from "react-router-dom";

// Importar as funções GET da API
import { 
  obterPropriedades, 
  obterCulturas, 
  obterPragas, 
  obterDoencas,
  obterResumoGeral,
  obterOcorrencias,
  obterAlertasAtivos
} from '../services/api.js';

const MonitoramentoPage = () => {
  const [dados, setDados] = useState({
    propriedades: [],
    culturas: [],
    pragas: [],
    doencas: [],
    ocorrencias: [],
    alertas: [],
    resumo: {
      totalPropriedades: 0,
      totalCulturas: 0,
      totalPragas: 0,
      totalDoencas: 0,
      alertasAtivos: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroSelecionado, setFiltroSelecionado] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');

  // Carregar todos os dados ao montar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Carregando dados para monitoramento...');

      // Fazer todas as requisições em paralelo
      const [propriedades, culturas, pragas, doencas, ocorrencias, alertas] = await Promise.all([
        obterPropriedades().catch(err => { console.warn('Erro ao carregar propriedades:', err); return []; }),
        obterCulturas().catch(err => { console.warn('Erro ao carregar culturas:', err); return []; }),
        obterPragas().catch(err => { console.warn('Erro ao carregar pragas:', err); return []; }),
        obterDoencas().catch(err => { console.warn('Erro ao carregar doenças:', err); return []; }),
        obterOcorrencias().catch(err => { console.warn('Erro ao carregar ocorrências:', err); return []; }),
        obterAlertasAtivos().catch(err => { console.warn('Erro ao carregar alertas:', err); return []; })
      ]);

      // Calcular resumo
      const resumo = {
        totalPropriedades: propriedades.length,
        totalCulturas: culturas.length,
        totalPragas: pragas.length,
        totalDoencas: doencas.length,
        alertasAtivos: alertas.length
      };

      setDados({
        propriedades,
        culturas,
        pragas,
        doencas,
        ocorrencias,
        alertas,
        resumo
      });

      console.log('Dados carregados com sucesso:', resumo);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados do sistema. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar dados baseado no filtro selecionado e termo de busca
  const getDadosFiltrados = () => {
    let dadosFiltrados = [];

    switch (filtroSelecionado) {
      case 'propriedades':
        dadosFiltrados = dados.propriedades;
        break;
      case 'culturas':
        dadosFiltrados = dados.culturas;
        break;
      case 'pragas':
        dadosFiltrados = dados.pragas;
        break;
      case 'doencas':
        dadosFiltrados = dados.doencas;
        break;
      case 'ocorrencias':
        dadosFiltrados = dados.ocorrencias;
        break;
      default:
        dadosFiltrados = [
          ...dados.propriedades.map(item => ({...item, tipo: 'Propriedade'})),
          ...dados.culturas.map(item => ({...item, tipo: 'Cultura'})),
          ...dados.pragas.map(item => ({...item, tipo: 'Praga'})),
          ...dados.doencas.map(item => ({...item, tipo: 'Doença'}))
        ];
    }

    // Aplicar busca por termo
    if (termoBusca) {
      dadosFiltrados = dadosFiltrados.filter(item =>
        Object.values(item).some(value =>
          value && value.toString().toLowerCase().includes(termoBusca.toLowerCase())
        )
      );
    }

    return dadosFiltrados;
  };

  const renderItemCard = (item, index) => {
    const tipo = item.tipo || 'Item';
    
    return (
      <div key={`${tipo}-${item.id || index}`} className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800">{item.nome || 'Nome não informado'}</h3>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{tipo}</span>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          {item.responsavel && <p><strong>Responsável:</strong> {item.responsavel}</p>}
          {item.tamanhoHa && <p><strong>Tamanho:</strong> {item.tamanhoHa} ha</p>}
          {item.tempoCultivoDias && <p><strong>Tempo de cultivo:</strong> {item.tempoCultivoDias} dias</p>}
          {item.epocaPlantio && <p><strong>Época de plantio:</strong> {item.epocaPlantio}</p>}
          {item.nomeCientifico && <p><strong>Nome científico:</strong> {item.nomeCientifico}</p>}
          {item.sintomas && <p><strong>Sintomas:</strong> {item.sintomas}</p>}
          {item.tratamentos && <p><strong>Tratamentos:</strong> {item.tratamentos}</p>}
          {item.descricao && <p><strong>Descrição:</strong> {item.descricao}</p>}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f5f8f2] text-gray-800">
        <aside className="w-60 bg-white border-r shadow-md p-4 space-y-4">
          <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center gap-2">
            <FaSeedling /> AgroSistema
          </h2>
        </aside>
        <main className="flex-1 p-10 flex items-center justify-center">
          <div className="text-center">
            <FaSync className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Carregando dados do sistema...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f8f2] text-gray-800">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r shadow-md p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center gap-2">
          <FaSeedling /> AgroSistema
        </h2>
        <nav className="space-y-3">
          <Link
            to="/cadastro"
            className="flex items-center gap-2 text-green-700 hover:font-semibold">
            <FaHome /> Cadastro
          </Link>
          <Link
            to="/monitoramento"
            className="flex items-center gap-2 text-green-700 hover:font-semibold font-semibold"
          >
            <FaTractor /> Monitoramento
          </Link>
          <Link
            to="/ocorrencias"
            className="flex items-center gap-2 text-green-700 hover:font-semibold"
          >
            <FaBug /> Ocorrências
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-green-900">Monitoramento</h1>
          <button 
            onClick={carregarDados}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
          >
            <FaSync /> Atualizar
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Propriedades</h3>
            <p className="text-3xl font-bold text-green-600">{dados.resumo.totalPropriedades}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Culturas</h3>
            <p className="text-3xl font-bold text-blue-600">{dados.resumo.totalCulturas}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pragas</h3>
            <p className="text-3xl font-bold text-orange-600">{dados.resumo.totalPragas}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Doenças</h3>
            <p className="text-3xl font-bold text-red-600">{dados.resumo.totalDoencas}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Alertas</h3>
            <p className="text-3xl font-bold text-yellow-600">{dados.resumo.alertasAtivos}</p>
          </div>
        </div>

        {/* Alertas Ativos */}
        {dados.alertas.length > 0 && (
          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">⚠️ Alertas Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dados.alertas.map((alerta, index) => (
                <div key={index} className="bg-white rounded p-4 border-l-4 border-yellow-500">
                  <p className="font-medium">{alerta.titulo || 'Alerta'}</p>
                  <p className="text-sm text-gray-600">{alerta.descricao || 'Descrição não disponível'}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filtros e Busca */}
        <section className="bg-white rounded-lg p-6 shadow-md mb-10">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <FaEye className="text-green-600" />
              <span className="font-medium">Filtrar por:</span>
            </div>
            
            <select 
              value={filtroSelecionado}
              onChange={(e) => setFiltroSelecionado(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="todos">Todos os dados</option>
              <option value="propriedades">Propriedades</option>
              <option value="culturas">Culturas</option>
              <option value="pragas">Pragas</option>
              <option value="doencas">Doenças</option>
              <option value="ocorrencias">Ocorrências</option>
            </select>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </section>

        {/* Lista de Dados */}
        <section className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-6">
            Dados do Sistema 
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({getDadosFiltrados().length} {getDadosFiltrados().length === 1 ? 'item' : 'itens'} encontrados)
            </span>
          </h2>
          
          {getDadosFiltrados().length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaEye className="text-4xl mx-auto mb-4 opacity-50" />
              <p>Nenhum dado encontrado com os filtros aplicados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDadosFiltrados().map((item, index) => renderItemCard(item, index))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MonitoramentoPage;