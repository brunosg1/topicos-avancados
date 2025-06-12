import React, { useState } from 'react';
import { FaSeedling, FaHome, FaTractor, FaBug, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

import { cadastrarPropriedade } from '../services/api.js';
import { cadastrarCultura } from '../services/api.js';
import { cadastrarTipoPraga } from '../services/api.js';
import { cadastrarTipoDoenca } from '../services/api.js';

const CadastroPage = () => {

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormDataProp(prev => ({
        ...prev,
        [name]: value
      }));
    };

  const [formDataProp, setFormDataProp] = useState({
      nome: '',
      tamanhoHa: '',
      responsavel: '',
    });

  const handleSubmitProp = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    // setError('');

    try {
      console.log("cadastrando propriedade...");
      console.log("nome:", formDataProp.nome);
      console.log("tamanho:", formDataProp.tamanhoHa);
      console.log("responsavel:", formDataProp.responsavel);

      const tamanhoHaInt = parseInt(formDataProp.tamanhoHa, 10);

      if (isNaN(tamanhoHaInt)) {
        alert("Tamanho da propriedade deve ser um número válido.");
        return;
      }

      const response = await cadastrarPropriedade({
              nome: formDataProp.nome,
              tamanhoHa: tamanhoHaInt,
              responsavel: formDataProp.responsavel
            });

      console.log(response);
      
    } catch (error) {
      console.log(error);
    } finally {
     
    }
  };

  const handleSubmitDoencas = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      
      
    } catch (error) {
     
    } finally {
     
    }
  };

  const handleSubmitPragas = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      
      
    } catch (error) {
     
    } finally {
     
    }
  };

  const handleSubmitCultura = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      
      
    } catch (error) {
     
    } finally {
     
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
            to="/cadastro"
            className="flex items-center gap-2 text-green-700 hover:font-semibold">
            <FaHome /> Cadastro
          </Link>
          <Link
            to="/monitoramento"
            className="flex items-center gap-2 text-green-700 hover:font-semibold"
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
        <h1 className="text-4xl font-bold mb-10 text-green-900">Cadastro</h1>

        <div className="space-y-10">

          {/* Card - Propriedade */}
          <section className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cadastrar Propriedade</h2>
            <form onSubmit={handleSubmitProp}>
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  name="nome"
                  value={formDataProp.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome da propriedade"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="number"
                  name="tamanhoHa"
                  value={formDataProp.tamanhoHa}
                  onChange={handleInputChange}
                  required
                  placeholder="Tamanho da propriedade"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="text"
                  name="responsavel"
                  value={formDataProp.responsavel}
                  onChange={handleInputChange}
                  required
                  placeholder="Responsavel da propriedade"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">
                  <FaCheck /> Salvar
                </button>
              </div>
            </form>
          </section>

          {/* Card - Cultura */}
          <section className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cadastrar Cultura</h2>
            <form onSubmit={handleSubmitCultura}>
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Nome da cultura"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="text"
                  placeholder="Tempo de Cultivo em Dias"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="text"
                  placeholder="Epoca do plantio"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">
                  <FaCheck /> Salvar
                </button>
              </div>
            </form>
          </section>

          {/* Card - Problema */}
          <section className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cadastrar Tipo de Praga </h2>
            <form onSubmit={handleSubmitPragas}>
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Nome da praga"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="text"
                  placeholder="Nome cientifico da praga"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="text"
                  placeholder="Culturas afetadas"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="text"
                  placeholder="Descrição"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">
                  <FaCheck /> Salvar
                </button>
              </div>
            </form>
            
          </section>

           <section className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cadastrar Tipo de Doença </h2>
            <form onSubmit={handleSubmitDoencas}>
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Nome da doença"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="text"
                  placeholder="Sintoma da doença"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="text"
                  placeholder="Culturas afetadas"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <input
                  type="text"
                  placeholder="Tratamentos"
                  className="border border-gray-300 rounded px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">
                  <FaCheck /> Salvar
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