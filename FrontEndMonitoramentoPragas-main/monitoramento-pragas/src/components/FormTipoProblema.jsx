import { useState } from "react";
import { cadastrarTipoProblema } from "../services/api";

export default function FormTipoProblema() {
  const [nome, setNome] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await cadastrarTipoProblema({ nome });
    setNome("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded">
      <h2 className="text-xl font-semibold">Cadastrar Tipo de Praga ou Doença</h2>
      <input
        className="border p-2 mt-2 w-full"
        placeholder="Nome do problema"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button className="mt-2 bg-green-700 text-white px-4 py-2 rounded" type="submit">
        Salvar
      </button>
    </form>
  );
}
