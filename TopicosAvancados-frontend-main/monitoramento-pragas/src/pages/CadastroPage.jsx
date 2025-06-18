import React, { useState } from 'react';
import { FaSeedling, FaHome, FaTractor, FaBug, FaCheck, FaSpinner } from "react-icons/fa"; // Importado FaSpinner para o loading
import { Link } from "react-router-dom";

import { cadastrarPropriedade } from '../services/api.js';
import { cadastrarCultura } from '../services/api.js';
import { cadastrarTipoPraga } from '../services/api.js';
import { cadastrarTipoDoenca } from '../services/api.js';


const CadastroPage = () => {

  // Estados para Propriedade
  const [formDataProp, setFormDataProp] = useState({
    nome: '',
    tamanhoHa: '',
    responsavel: '',
  });
  const [isLoadingProp, setIsLoadingProp] = useState(false);
  const [messageProp, setMessageProp] = useState('');

  // Estados para Cultura
  const [formDataCultura, setFormDataCult] = useState({
    nomeCultura: '',
    tempoCultivoDias: '',
    epocaPlantio: '',
  });
  const [isLoadingCult, setIsLoadingCult] = useState(false);
  const [messageCult, setMessageCult] = useState('');

  // Estados para Praga
  const [formDataPraga, setFormDataPraga] = useState({
    nomePraga: '',
    nomeCientificoPraga: '',
    culturasAfetadas: '',
    descricaoPraga: '',
  });
  const [isLoadingPraga, setIsLoadingPraga] = useState(false);
  const [messagePraga, setMessagePraga] = useState('');

  // Estados para Doença
  const [formDataDoenca, setFormDataDoen] = useState({
    nomeDoenca: '',
    sintomasDoenca: '',
    culturasAfetadasDoenca: '',
    tratamentosDoenca: '',
  });
  const [isLoadingDoenca, setIsLoadingDoenca] = useState(false);
  const [messageDoenca, setMessageDoenca] = useState('');


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Lógica para atualizar o estado correto com base no "name" do input
    if (name === "nome" || name === "tamanhoHa" || name === "responsavel") {
      setFormDataProp(prev => ({ ...prev, [name]: value }));
    } else if (name === "nomeCultura" || name === "tempoCultivoDias" || name === "epocaPlantio") {
      setFormDataCult(prev => ({ ...prev, [name]: value }));
    } else if (name === "nomePraga" || name === "nomeCientificoPraga" || name === "culturasAfetadas" || name === "descricaoPraga") {
      setFormDataPraga(prev => ({ ...prev, [name]: value }));
    } else if (name === "nomeDoenca" || name === "sintomasDoenca" || name === "culturasAfetadasDoenca" || name === "tratamentosDoenca") {
      setFormDataDoen(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmitProp = async (e) => {
    e.preventDefault();
    setIsLoadingProp(true);
    setMessageProp('');

    try {
      console.log("cadastrando propriedade...");
      console.log("nome:", formDataProp.nome);
      console.log("tamanho:", formDataProp.tamanhoHa);
      console.log("responsavel:", formDataProp.responsavel);

      const tamanhoHaInt = parseInt(formDataProp.tamanhoHa, 10);

      if (isNaN(tamanhoHaInt)) {
        alert("Tamanho da propriedade deve ser um número válido.");
        setIsLoadingProp(false);
        return;
      }

      const response = await cadastrarPropriedade({
        nome: formDataProp.nome,
        tamanhoHa: tamanhoHaInt,
        responsavel: formDataProp.responsavel
      });

      console.log(response);
      alert("Propriedade cadastrada com sucesso!");
      setFormDataProp({ nome: '', tamanhoHa: '', responsavel: '' }); // Resetar campos
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar propriedade.");
    } finally {
      setIsLoadingProp(false);
    }
  };

  const handleSubmitDoencas = async (e) => {
    e.preventDefault();
    setIsLoadingDoenca(true);
    setMessageDoenca('');

    try {
      console.log("cadastrando Doença..");
      console.log("nome:", formDataDoenca.nomeDoenca);
      console.log("sintomas:", formDataDoenca.sintomasDoenca);
      console.log("culturasAfetadas:", formDataDoenca.culturasAfetadasDoenca);
      console.log("tratamentos:", formDataDoenca.tratamentosDoenca);

      const culturasAfetadasString = formDataDoenca.culturasAfetadasDoenca;
      const culturasAfetadasArrayDeString = culturasAfetadasString.split(',').map(item => item.trim());
      const culturasAfetadasInteiros = culturasAfetadasArrayDeString.map(Number);

      const response = await cadastrarTipoDoenca({
        nome: formDataDoenca.nomeDoenca,
        sintomas: formDataDoenca.sintomasDoenca,
        culturasAfetadas: culturasAfetadasInteiros,
        tratamentos: formDataDoenca.tratamentosDoenca
      });

      console.log(response);
      alert("Doença cadastrada com sucesso!");
      setFormDataDoen({ nomeDoenca: '', sintomasDoenca: '', culturasAfetadasDoenca: '', tratamentosDoenca: '' }); // Resetar campos
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar doença.");
    } finally {
      setIsLoadingDoenca(false);
    }
  };


  const handleSubmitPragas = async (e) => {
    e.preventDefault();
    setIsLoadingPraga(true);
    setMessagePraga('');

    try {
      console.log("cadastrando Praga...");
      console.log("nome:", formDataPraga.nomePraga);
      console.log("nomeCientifico:", formDataPraga.nomeCientificoPraga);
      console.log("culturas afetadas:", formDataPraga.culturasAfetadas);
      console.log("descricao:", formDataPraga.descricaoPraga);

      const culturasAfetadasString = formDataPraga.culturasAfetadas;
      const culturasAfetadasArrayDeString = culturasAfetadasString.split(',').map(item => item.trim());
      const culturasAfetadasInteiros = culturasAfetadasArrayDeString.map(Number);

      const response = await cadastrarTipoPraga({
        nome: formDataPraga.nomePraga,
        nomeCientifico: formDataPraga.nomeCientificoPraga,
        descricao: formDataPraga.descricaoPraga,
        culturasAfetadas: culturasAfetadasInteiros
      });

      console.log(response);
      alert("Praga cadastrada com sucesso!");
      setFormDataPraga({ nomePraga: '', nomeCientificoPraga: '', culturasAfetadas: '', descricaoPraga: '' }); // Resetar campos
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar praga.");
    } finally {
      setIsLoadingPraga(false);
    }
  };


  const handleSubmitCultura = async (e) => {
    e.preventDefault();
    setIsLoadingCult(true);
    setMessageCult('');

    try {
      console.log("cadastrando Cultura...");
      console.log("nome:", formDataCultura.nomeCultura);
      console.log("tempoCultivoDias:", formDataCultura.tempoCultivoDias);
      console.log("epocaPlantio:", formDataCultura.epocaPlantio);

      const tempoCultivoDias = parseInt(formDataCultura.tempoCultivoDias, 10);

      if (isNaN(tempoCultivoDias)) {
        alert("Tempo de cultivo deve ser um número válido.");
        setIsLoadingCult(false);
        return;
      }

      const response = await cadastrarCultura({
        nome: formDataCultura.nomeCultura,
        tempoCultivoDias: formDataCultura.tempoCultivoDias,
        epocaPlantio: formDataCultura.epocaPlantio
      });

      console.log(response);
      alert("Cultura cadastrada com sucesso!");
      setFormDataCult({ nomeCultura: '', tempoCultivoDias: '', epocaPlantio: '' }); // Resetar campos
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar cultura.");
    } finally {
      setIsLoadingCult(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-[#f5f8f2] text-gray-800">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r shadow-md p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center gap-2">
          <FaSeedling /> AgroSistema
        </h2>
        <nav className="space-y-3">
          <Link
            to="/login"
            className="flex items-center gap-2 text-green-700 hover:font-semibold">
            <FaHome /> Logout
          </Link>
          <Link to="/cadastro" className="flex items-center gap-2 text-green-700 hover:font-semibold font-semibold">
            <FaHome /> Cadastro
          </Link>
          <Link to="/monitoramento" className="flex items-center gap-2 text-green-700 hover:font-semibold">
            <FaTractor /> Monitoramento
          </Link>
          <Link to="/ocorrencias" className="flex items-center gap-2 text-green-700 hover:font-semibold">
            <FaBug /> Ocorrências
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-10 text-green-900">Cadastro</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card - Propriedade */}
          <section className="bg-white rounded-2xl p-6 shadow-lg border border-green-300 relative"> {/* Adicionado 'relative' para posicionar o spinner */}
            {isLoadingProp && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl z-10">
                <FaSpinner className="animate-spin text-green-600 text-4xl" />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-4 text-green-800">Cadastrar Propriedade</h2>
            <form onSubmit={handleSubmitProp}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="nome"
                  value={formDataProp.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome da propriedade"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  name="tamanhoHa"
                  value={formDataProp.tamanhoHa}
                  onChange={handleInputChange}
                  required
                  placeholder="Tamanho da propriedade (hectares)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="responsavel"
                  value={formDataProp.responsavel}
                  onChange={handleInputChange}
                  required
                  placeholder="Responsável da propriedade"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out" disabled={isLoadingProp}>
                  {isLoadingProp ? 'Salvando...' : (<><FaCheck /> Salvar</>)}
                </button>
              </div>
            </form>
          </section>

          {/* Card - Cultura */}
          <section className="bg-white rounded-2xl p-6 shadow-lg border border-green-300 relative">
            {isLoadingCult && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl z-10">
                <FaSpinner className="animate-spin text-green-600 text-4xl" />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-4 text-green-800">Cadastrar Cultura</h2>
            <form onSubmit={handleSubmitCultura}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="nomeCultura"
                  value={formDataCultura.nomeCultura}
                  onChange={handleInputChange}
                  placeholder="Nome da cultura"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="tempoCultivoDias"
                  value={formDataCultura.tempoCultivoDias}
                  onChange={handleInputChange}
                  placeholder="Tempo de Cultivo em Dias"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="epocaPlantio"
                  value={formDataCultura.epocaPlantio}
                  onChange={handleInputChange}
                  placeholder="Época do plantio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out" disabled={isLoadingCult}>
                  {isLoadingCult ? 'Salvando...' : (<><FaCheck /> Salvar</>)}
                </button>
              </div>
            </form>
          </section>

          {/* Card - Praga */}
          <section className="bg-white rounded-2xl p-6 shadow-lg border border-green-300 relative">
            {isLoadingPraga && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl z-10">
                <FaSpinner className="animate-spin text-green-600 text-4xl" />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-4 text-green-800">Cadastrar Tipo de Praga</h2>
            <form onSubmit={handleSubmitPragas}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="nomePraga"
                  value={formDataPraga.nomePraga}
                  onChange={handleInputChange}
                  placeholder="Nome da praga"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="nomeCientificoPraga"
                  value={formDataPraga.nomeCientificoPraga}
                  onChange={handleInputChange}
                  placeholder="Nome científico da praga"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="culturasAfetadas"
                  value={formDataPraga.culturasAfetadas}
                  onChange={handleInputChange}
                  placeholder="Culturas afetadas (IDs separados por vírgula)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="descricaoPraga"
                  value={formDataPraga.descricaoPraga}
                  onChange={handleInputChange}
                  placeholder="Descrição"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out" disabled={isLoadingPraga}>
                  {isLoadingPraga ? 'Salvando...' : (<><FaCheck /> Salvar</>)}
                </button>
              </div>
            </form>
          </section>

          {/* Card - Doença */}
          <section className="bg-white rounded-2xl p-6 shadow-lg border border-green-300 relative">
            {isLoadingDoenca && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-2xl z-10">
                <FaSpinner className="animate-spin text-green-600 text-4xl" />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-4 text-green-800">Cadastrar Tipo de Doença</h2>
            <form onSubmit={handleSubmitDoencas}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="nomeDoenca"
                  value={formDataDoenca.nomeDoenca}
                  onChange={handleInputChange}
                  placeholder="Nome da doença"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="sintomasDoenca"
                  value={formDataDoenca.sintomasDoenca}
                  onChange={handleInputChange}
                  placeholder="Sintomas da doença"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="culturasAfetadasDoenca"
                  value={formDataDoenca.culturasAfetadasDoenca}
                  onChange={handleInputChange}
                  placeholder="Culturas afetadas (IDs separados por vírgula)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="tratamentosDoenca"
                  value={formDataDoenca.tratamentosDoenca}
                  onChange={handleInputChange}
                  placeholder="Tratamentos"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out" disabled={isLoadingDoenca}>
                  {isLoadingDoenca ? 'Salvando...' : (<><FaCheck /> Salvar</>)}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );

}


export default CadastroPage;