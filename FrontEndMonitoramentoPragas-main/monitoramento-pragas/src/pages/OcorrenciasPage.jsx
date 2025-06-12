import FormOcorrencia from "../components/FormOcorrencia";
import ListaOcorrencias from "../components/ListaOcorrencias";

export default function OcorrenciasPage() {
  return (
    
    <div className="p-4 space-y-8">
      
      <h1 className="text-2xl font-bold text-green-900">Registro de Ocorrências</h1>
      <FormOcorrencia />
      <ListaOcorrencias />
    </div>
  );
}
