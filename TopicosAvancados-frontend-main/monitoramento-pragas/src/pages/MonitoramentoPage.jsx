import React, { useState, useEffect } from 'react';
import { FaSeedling, FaHome, FaTractor, FaBug, FaEye, FaSearch, FaSync, FaTrash, FaEdit, FaTimes, FaSpinner, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

// Importar as funções GET, DELETE e PUT da API
import {
  obterPropriedades,
  obterCulturas,
  obterPragas,
  obterDoencas,
  obterOcorrencias,
  obterAlertasAtivos,
  deletarPropriedade,
  deletarCultura,
  deletarPraga,
  deletarDoenca,
  editarPropriedade,
  editarCultura,
  editarTipoPraga,
  editarTipoDoenca
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
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [formDataEdit, setFormDataEdit] = useState({});
  const [isEditing, setIsEditing] = useState(false);


  // Carregar todos os dados ao montar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Carregando dados para monitoramento...');

      const [propriedades, culturas, pragas, doencas, ocorrencias, alertas] = await Promise.all([
        obterPropriedades().catch(err => { console.warn('Erro ao carregar propriedades:', err); return []; }),
        obterCulturas().catch(err => { console.warn('Erro ao carregar culturas:', err); return []; }),
        obterPragas().catch(err => { console.warn('Erro ao carregar pragas:', err); return []; }),
        obterDoencas().catch(err => { console.warn('Erro ao carregar doenças:', err); return []; }),
        obterOcorrencias().catch(err => { console.warn('Erro ao carregar ocorrências:', err); return []; }),
        obterAlertasAtivos().catch(err => { console.warn('Erro ao carregar alertas:', err); return []; })
      ]);

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

  // Funções de Deleção
  const handleDelete = async (id, tipo) => {
    if (!window.confirm(`Tem certeza que deseja excluir este(a) ${tipo}?`)) {
      return;
    }

    setDeletingId(id);
    setError('');

    try {
      console.log(`[DELETE] Tentando deletar ${tipo} com ID: ${id}`);
      let response;
      switch (tipo.toLowerCase()) {
        case 'propriedade':
          response = await deletarPropriedade(id);
          break;
        case 'cultura':
          response = await deletarCultura(id);
          break;
        case 'praga':
          response = await deletarPraga(id);
          break;
        case 'doença':
          response = await deletarDoenca(id);
          break;
        default:
          console.warn('Tipo de item desconhecido para deleção:', tipo);
          return;
      }
      console.log(`[DELETE] Item ${tipo} com ID ${id} deletado com sucesso:`, response);
      alert(`${tipo} excluído(a) com sucesso!`);
      carregarDados();
    } catch (error) {
      console.error(`[DELETE] Erro ao deletar ${tipo} com ID ${id}:`, error);
      setError(`Erro ao excluir ${tipo}.`);
      alert(`Erro ao excluir ${tipo}.`);
    } finally {
      setDeletingId(null);
    }
  };

  // Funções de Edição
  const openEditModal = (item) => {
    setItemToEdit(item);
    // Configura formDataEdit com base no tipo de item
    let initialFormData = { ...item };

    switch (item.tipo) {
      case 'Propriedade':
        // No caso de Propriedade, os nomes dos campos já correspondem
        break;
      case 'Cultura':
        // Preenche o nome da cultura automaticamente
        initialFormData = { ...item, nomeCultura: item.nome };
        break;
      case 'Praga':
        // Preenche os campos, mas deixa 'culturasAfetadas' em branco
        initialFormData = {
          ...item,
          nomePraga: item.nome,
          nomeCientificoPraga: item.nomeCientifico,
          descricaoPraga: item.descricao,
          culturasAfetadas: '' // Deixar em branco
        };
        break;
      case 'Doença':
        // Preenche os campos, mas deixa 'culturasAfetadas' em branco
        initialFormData = {
          ...item,
          nomeDoenca: item.nome,
          sintomasDoenca: item.sintomas,
          tratamentosDoenca: item.tratamentos,
          culturasAfetadas: '' // Deixar em branco
        };
        break;
      default:
        break;
    }
    setFormDataEdit(initialFormData);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setItemToEdit(null);
    setFormDataEdit({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setFormDataEdit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    setError('');

    try {
      let response;
      const tipo = itemToEdit.tipo;

      console.log(`[EDIT] Tentando editar ${tipo} com ID ${itemToEdit.id}`);

      switch (tipo.toLowerCase()) {
        case 'propriedade':
          const tamanhoHaInt = parseInt(formDataEdit.tamanhoHa, 10);
          if (isNaN(tamanhoHaInt)) {
            alert("Tamanho da propriedade deve ser um número válido.");
            setIsEditing(false);
            return;
          }
          const propDataToSend = {
            id: formDataEdit.id,
            nome: formDataEdit.nome,
            tamanhoHa: tamanhoHaInt,
            responsavel: formDataEdit.responsavel
          };
          console.log('[EDIT - Propriedade] Dados enviados:', propDataToSend);
          response = await editarPropriedade(propDataToSend);
          break;
        case 'cultura':
          const tempoCultivoDiasInt = parseInt(formDataEdit.tempoCultivoDias, 10);
          if (isNaN(tempoCultivoDiasInt)) {
            alert("Tempo de cultivo deve ser um número válido.");
            setIsEditing(false);
            return;
          }
          const cultDataToSend = {
            id: formDataEdit.id,
            nome: formDataEdit.nomeCultura, // Usar nomeCultura do formulário
            tempoCultivoDias: tempoCultivoDiasInt,
            epocaPlantio: formDataEdit.epocaPlantio
          };
          console.log('[EDIT - Cultura] Dados enviados:', cultDataToSend);
          response = await editarCultura(cultDataToSend);
          break;
        case 'praga':
          // Validação para culturasAfetadas de Praga
          if (!formDataEdit.culturasAfetadas || formDataEdit.culturasAfetadas.trim() === '') {
            alert("O campo 'Culturas Afetadas' para Praga não pode ser vazio.");
            setIsEditing(false);
            return;
          }
          const culturasAfetadasPragaArray = formDataEdit.culturasAfetadas.split(',').map(item => item.trim());
          const pragaDataToSend = {
            id: formDataEdit.id,
            nome: formDataEdit.nomePraga,
            nomeCientifico: formDataEdit.nomeCientificoPraga,
            descricao: formDataEdit.descricaoPraga,
            culturasAfetadas: culturasAfetadasPragaArray
          };
          console.log('[EDIT - Praga] Dados enviados:', pragaDataToSend);
          response = await editarTipoPraga(pragaDataToSend);
          break;
        case 'doença':
          // Validação para culturasAfetadas de Doença
          if (!formDataEdit.culturasAfetadas || formDataEdit.culturasAfetadas.trim() === '') {
            alert("O campo 'Culturas Afetadas' para Doença não pode ser vazio.");
            setIsEditing(false);
            return;
          }
          const culturasAfetadasDoencaArray = formDataEdit.culturasAfetadas.split(',').map(item => item.trim());
          const doencaDataToSend = {
            id: formDataEdit.id,
            nome: formDataEdit.nomeDoenca,
            sintomas: formDataEdit.sintomasDoenca,
            culturasAfetadas: culturasAfetadasDoencaArray,
            tratamentos: formDataEdit.tratamentosDoenca
          };
          console.log('[EDIT - Doença] Dados enviados:', doencaDataToSend);
          response = await editarTipoDoenca(doencaDataToSend);
          break;
        default:
          console.warn('Tipo de item desconhecido para edição:', tipo);
          setIsEditing(false);
          return;
      }
      console.log(`[EDIT] Item ${tipo} com ID ${itemToEdit.id} editado com sucesso:`, response);
      alert(`${tipo} atualizado(a) com sucesso!`);
      closeEditModal();
      carregarDados();
    } catch (error) {
      console.error(`[EDIT] Erro ao editar ${tipo} com ID ${itemToEdit.id}:`, error);
      setError(`Erro ao atualizar ${tipo}.`);
      alert(`Erro ao atualizar ${tipo}.`);
    } finally {
      setIsEditing(false);
    }
  };


  // Filtrar dados baseado no filtro selecionado e termo de busca
  const getDadosFiltrados = () => {
    let dadosFiltrados = [];

    switch (filtroSelecionado) {
      case 'propriedades':
        dadosFiltrados = dados.propriedades.map(item => ({ ...item, tipo: 'Propriedade' }));
        break;
      case 'culturas':
        dadosFiltrados = dados.culturas.map(item => ({ ...item, tipo: 'Cultura' }));
        break;
      case 'pragas':
        dadosFiltrados = dados.pragas.map(item => ({ ...item, tipo: 'Praga' }));
        break;
      case 'doencas':
        dadosFiltrados = dados.doencas.map(item => ({ ...item, tipo: 'Doença' }));
        break;
      case 'ocorrencias':
        dadosFiltrados = dados.ocorrencias.map(item => ({ ...item, tipo: 'Ocorrência', nome: `Ocorrência ${item.id}` }));
        break;
      default:
        dadosFiltrados = [
          ...dados.propriedades.map(item => ({ ...item, tipo: 'Propriedade' })),
          ...dados.culturas.map(item => ({ ...item, tipo: 'Cultura' })),
          ...dados.pragas.map(item => ({ ...item, tipo: 'Praga' })),
          ...dados.doencas.map(item => ({ ...item, tipo: 'Doença' }))
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
    const itemId = item.id;

    // Ajusta o nome de exibição para corresponder aos nomes dos campos da API
    const nomeExibicao = item.nome || item.nomeCultura || item.nomePraga || item.nomeDoenca || `Item ${itemId}`;

    return (
      <div key={`${tipo}-${itemId || index}`} className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500 relative">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800">{nomeExibicao}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{tipo}</span>
            <button
              onClick={() => openEditModal(item)}
              className="text-blue-500 hover:text-blue-700 transition"
              title={`Editar ${tipo}`}
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(itemId, tipo)}
              className="text-red-500 hover:text-red-700 transition"
              title={`Excluir ${tipo}`}
              disabled={deletingId === itemId}
            >
              {deletingId === itemId ? <FaSpinner className="animate-spin" /> : <FaTrash />}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          {itemId && <p><strong>ID:</strong> {itemId}</p>}
          {item.responsavel && <p><strong>Responsável:</strong> {item.responsavel}</p>}
          {item.tamanhoHa && <p><strong>Tamanho:</strong> {item.tamanhoHa} ha</p>}
          {item.tempoCultivoDias && <p><strong>Tempo de cultivo:</strong> {item.tempoCultivoDias} dias</p>}
          {item.epocaPlantio && <p><strong>Época de plantio:</strong> {item.epocaPlantio}</p>}
          {item.nomeCientifico && <p><strong>Nome científico:</strong> {item.nomeCientifico}</p>}
          {item.sintomas && <p><strong>Sintomas:</strong> {item.sintomas}</p>}
          {/* Mostra culturas afetadas como string se for array de strings */}
          {item.culturasAfetadas && Array.isArray(item.culturasAfetadas) && item.culturasAfetadas.length > 0 &&
            <p><strong>Culturas Afetadas:</strong> {item.culturasAfetadas.join(', ')}</p>
          }
          {item.tratamentos && <p><strong>Tratamentos:</strong> {item.tratamentos}</p>}
          {item.descricao && <p><strong>Descrição:</strong> {item.descricao}</p>}
          {item.data && item.tipo === 'Ocorrência' && <p><strong>Data:</strong> {new Date(item.data).toLocaleDateString()}</p>}
          {item.localizacao && item.tipo === 'Ocorrência' && <p><strong>Localização:</strong> {item.localizacao}</p>}
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

      {/* Modal de Edição */}
      {isModalOpen && itemToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md relative">
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              title="Fechar"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-green-800">
              Editar {itemToEdit.tipo}
            </h2>

            <form onSubmit={handleSubmitEdit} className="space-y-4">
              {itemToEdit.tipo === 'Propriedade' && (
                <>
                  <label className="block">
                    <span className="text-gray-700">Nome:</span>
                    <input
                      type="text"
                      name="nome"
                      value={formDataEdit.nome || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Tamanho (ha):</span>
                    <input
                      type="number"
                      name="tamanhoHa"
                      value={formDataEdit.tamanhoHa || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Responsável:</span>
                    <input
                      type="text"
                      name="responsavel"
                      value={formDataEdit.responsavel || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </label>
                </>
              )}

              {itemToEdit.tipo === 'Cultura' && (
                <>
                  <label className="block">
                    <span className="text-gray-700">Nome da Cultura:</span>
                    <input
                      type="text"
                      name="nomeCultura"
                      value={formDataEdit.nomeCultura || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Tempo de Cultivo (Dias):</span>
                    <input
                      type="number"
                      name="tempoCultivoDias"
                      value={formDataEdit.tempoCultivoDias || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Época de Plantio:</span>
                    <input
                      type="text"
                      name="epocaPlantio"
                      value={formDataEdit.epocaPlantio || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </label>
                </>
              )}

              {itemToEdit.tipo === 'Praga' && (
                <>
                  <label className="block">
                    <span className="text-gray-700">Nome da Praga:</span>
                    <input
                      type="text"
                      name="nomePraga"
                      value={formDataEdit.nomePraga || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Nome Científico:</span>
                    <input
                      type="text"
                      name="nomeCientificoPraga"
                      value={formDataEdit.nomeCientificoPraga || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Culturas Afetadas (Nomes separados por vírgula):</span>
                    <input
                      type="text"
                      name="culturasAfetadas"
                      value={formDataEdit.culturasAfetadas || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required // Adicionado required aqui para a validação
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Descrição:</span>
                    <textarea
                      name="descricaoPraga"
                      value={formDataEdit.descricaoPraga || ''}
                      onChange={handleEditFormChange}
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    ></textarea>
                  </label>
                </>
              )}

              {itemToEdit.tipo === 'Doença' && (
                <>
                  <label className="block">
                    <span className="text-gray-700">Nome da Doença:</span>
                    <input
                      type="text"
                      name="nomeDoenca"
                      value={formDataEdit.nomeDoenca || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Sintomas:</span>
                    <textarea
                      name="sintomasDoenca"
                      value={formDataEdit.sintomasDoenca || ''}
                      onChange={handleEditFormChange}
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    ></textarea>
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Culturas Afetadas (Nomes separados por vírgula):</span>
                    <input
                      type="text"
                      name="culturasAfetadas"
                      value={formDataEdit.culturasAfetadas || ''}
                      onChange={handleEditFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required // Adicionado required aqui para a validação
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">Tratamentos:</span>
                    <textarea
                      name="tratamentosDoenca"
                      value={formDataEdit.tratamentosDoenca || ''}
                      onChange={handleEditFormChange}
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    ></textarea>
                  </label>
                </>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                disabled={isEditing}
              >
                {isEditing ? <FaSpinner className="animate-spin" /> : <FaCheck />} {isEditing ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoramentoPage;