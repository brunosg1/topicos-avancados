// src/pages/OcorrenciasPage.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaSpinner, FaCheck, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import Sidebar from '../components/Sidebar'; // Importe o componente Sidebar
import { createOccurrence, getAllOccurrences, updateOccurrence, deleteOccurrence } from '../services/api';

export default function OcorrenciasPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'praga', // Valor padrão
    description: '',
    location: '',
    severity: 'baixa', // Valor padrão
  });
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [occurrences, setOccurrences] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchOccurrences();
  }, []);

  const fetchOccurrences = async () => {
    setIsLoadingList(true);
    setListError('');
    try {
      const data = await getAllOccurrences();
      setOccurrences(data);
    } catch (error) {
      console.error("Erro ao carregar lista de ocorrências:", error);
      setListError('Erro ao carregar ocorrências. Tente novamente.');
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    setFormError('');
    setFormSuccess('');

    try {
      if (!formData.name || !formData.location || !formData.severity) {
        setFormError('Por favor, preencha todos os campos obrigatórios.');
        setIsLoadingForm(false);
        return;
      }

      const createdOccurrence = await createOccurrence(formData);
      console.log('Ocorrência registrada com sucesso:', createdOccurrence);
      setFormSuccess('Ocorrência registrada com sucesso!');

      setFormData({
        name: '',
        type: 'praga',
        description: '',
        location: '',
        severity: 'baixa',
      });

      fetchOccurrences();

    } catch (error) {
      console.error('Erro ao registrar ocorrência:', error);
      setFormError('Erro ao registrar ocorrência. Verifique os dados e tente novamente.');
    } finally {
      setIsLoadingForm(false);
      setTimeout(() => {
        setFormSuccess('');
        setFormError('');
      }, 5000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta ocorrência?')) {
      return;
    }

    try {
      await deleteOccurrence(id);
      console.log(`Ocorrência com ID ${id} deletada com sucesso.`);
      alert('Ocorrência excluída com sucesso!');
      fetchOccurrences();
    } catch (error) {
      console.error(`Erro ao deletar ocorrência com ID ${id}:`, error);
      alert('Erro ao excluir ocorrência. Tente novamente.');
    }
  };

  const openEditModal = (occurrence) => {
    setItemToEdit(occurrence);
    setEditFormData({
      id: occurrence.id,
      name: occurrence.name,
      type: occurrence.type,
      description: occurrence.description || '',
      location: occurrence.location,
      severity: occurrence.severity,
    });
    setIsEditModalOpen(true);
    setEditError('');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
    setEditFormData({});
    setEditError('');
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);
    setEditError('');

    try {
      if (!editFormData.name || !editFormData.location || !editFormData.severity) {
        setEditError('Por favor, preencha todos os campos obrigatórios.');
        setIsSavingEdit(false);
        return;
      }

      const inputToUpdate = {
        name: editFormData.name,
        type: editFormData.type,
        description: editFormData.description,
        location: editFormData.location,
        severity: editFormData.severity,
      };

      const updated = await updateOccurrence(editFormData.id, inputToUpdate);
      console.log('Ocorrência atualizada com sucesso:', updated);
      alert('Ocorrência atualizada com sucesso!');

      closeEditModal();
      fetchOccurrences();
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
      setEditError('Erro ao atualizar ocorrência. Tente novamente.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f8f2] text-gray-800"> {/* Contêiner flex para sidebar e conteúdo */}
      <Sidebar activeLink="/ocorrencias" /> {/* Adicione a Sidebar aqui */}

      <main className="flex-1 p-8"> {/* Conteúdo principal */}
        <h1 className="text-4xl font-bold text-green-900 mb-8">Registro e Monitoramento de Ocorrências</h1>

        {/* Seção do Formulário */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-6 flex items-center gap-2">
            <FaPlus /> Registrar Nova Ocorrência
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                <FaCheck className="inline mr-2" /> {formSuccess}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Ocorrência:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: Pulgão, Ferrugem"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo:
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="praga">Praga</option>
                <option value="doenca">Doença</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição (opcional):
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Detalhes sobre a ocorrência..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Localização (Ex: Fazenda, Lote):
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: Fazenda São João - Talhão 1"
                required
              />
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Severidade:
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
              disabled={isLoadingForm}
            >
              {isLoadingForm ? (
                <>
                  <FaSpinner className="animate-spin" /> Registrando...
                </>
              ) : (
                'Registrar Ocorrência'
              )}
            </button>
          </form>
        </section>

        {/* Seção da Lista de Ocorrências */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">Ocorrências Registradas</h2>

          {isLoadingList ? (
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-4xl text-green-600 mr-3" />
              <p className="text-lg text-gray-600">Carregando ocorrências...</p>
            </div>
          ) : listError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <FaTimes className="inline mr-2" /> {listError}
            </div>
          ) : occurrences.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>Nenhuma ocorrência registrada ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {occurrences.map((occurrence) => (
                <div key={occurrence.id} className="bg-gray-50 rounded-lg p-4 shadow-sm border-l-4 border-blue-500 relative">
                  <h3 className="font-bold text-lg text-gray-900">{occurrence.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">Tipo: {occurrence.type}</p>
                  <p className="text-sm text-gray-600">Local: {occurrence.location}</p>
                  {occurrence.description && <p className="text-sm text-gray-600">Descrição: {occurrence.description}</p>}
                  <p className="text-sm text-gray-600 capitalize">Severidade: <span className={`font-semibold ${occurrence.severity === 'alta' ? 'text-red-600' : occurrence.severity === 'media' ? 'text-orange-600' : 'text-green-600'}`}>{occurrence.severity}</span></p>
                  <p className="text-xs text-gray-500 mt-1">Registrado em: {new Date(occurrence.dateReported).toLocaleDateString()} {new Date(occurrence.dateReported).toLocaleTimeString()}</p>

                  {/* Botões de Ação */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(occurrence)}
                      className="text-blue-500 hover:text-blue-700 transition"
                      title="Editar Ocorrência"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(occurrence.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Excluir Ocorrência"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal de Edição */}
        {isEditModalOpen && itemToEdit && (
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
                Editar Ocorrência
              </h2>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                {editError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {editError}
                  </div>
                )}

                {/* ID da Ocorrência (somente leitura) */}
                <div>
                  <label htmlFor="edit-id" className="block text-sm font-medium text-gray-700 mb-1">
                    ID:
                  </label>
                  <input
                    type="text"
                    id="edit-id"
                    name="id"
                    value={editFormData.id || ''}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>

                {/* Nome da Ocorrência */}
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Ocorrência:
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                {/* Tipo de Ocorrência */}
                <div>
                  <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo:
                  </label>
                  <select
                    id="edit-type"
                    name="type"
                    value={editFormData.type || ''}
                    onChange={handleEditFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="praga">Praga</option>
                    <option value="doenca">Doença</option>
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (opcional):
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editFormData.description || ''}
                    onChange={handleEditFormChange}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>

                {/* Localização */}
                <div>
                  <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-1">
                    Localização:
                  </label>
                  <input
                    type="text"
                    id="edit-location"
                    name="location"
                    value={editFormData.location || ''}
                    onChange={handleEditFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                {/* Severidade */}
                <div>
                  <label htmlFor="edit-severity" className="block text-sm font-medium text-gray-700 mb-1">
                    Severidade:
                  </label>
                  <select
                    id="edit-severity"
                    name="severity"
                    value={editFormData.severity || ''}
                    onChange={handleEditFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                {/* Botão de Salvar Edição */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                  disabled={isSavingEdit}
                >
                  {isSavingEdit ? (
                    <>
                      <FaSpinner className="animate-spin" /> Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}