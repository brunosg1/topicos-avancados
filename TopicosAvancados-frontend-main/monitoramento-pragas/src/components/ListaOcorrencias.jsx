import { useEffect, useState } from "react";
import { listarOcorrencias } from "../services/api";

export default function ListaOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState([]);

  useEffect(() => {
    listarOcorrencias().then((res) => setOcorrencias(res.data));
  }, []);

  return (
    <div className="bg-white p-4 shadow-md rounded"  >
      <h2 className="text-xl font-semibold mb-2">Lista de Ocorrências</h2>
      <ul className="space-y-1">
        {ocorrencias.map((o, i) => (
          <li key={i} className="border p-2 rounded">
            Propriedade: {o.propriedadeId}, Cultura: {o.culturaId}, Problema: {o.problemaId}, Data: {o.data}
          </li>
        ))}
      </ul>
    </div>
  );
}
