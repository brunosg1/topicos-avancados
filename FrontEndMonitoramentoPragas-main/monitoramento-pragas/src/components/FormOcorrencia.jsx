import { useState } from "react";
import { registrarOcorrencia } from "../services/api";

export default function FormOcorrencia() {
  const [dados, setDados] = useState({
    propriedadeId: "",
    culturaId: "",
    problemaId: "",
    data: ""
  });

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registrarOcorrencia(dados);
    setDados({ propriedadeId: "", culturaId: "", problemaId: "", data: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded space-y-2">
      <h2 className="text-xl font-semibold">Registrar Ocorrência</h2>
      <input name="propriedadeId" placeholder="ID da Propriedade" value={dados.propriedadeId} onChange={handleChange} className="border p-2 w-full" />
      <input name="culturaId" placeholder="ID da Cultura" value={dados.culturaId} onChange={handleChange} className="border p-2 w-full" />
      <input name="problemaId" placeholder="ID da Praga/Doença" value={dados.problemaId} onChange={handleChange} className="border p-2 w-full" />
      <input name="data" type="date" value={dados.data} onChange={handleChange} className="border p-2 w-full" />
      <button className="bg-green-700 text-white px-4 py-2 rounded" type="submit">
        Salvar Ocorrência
      </button>
    </form>
  );
}
