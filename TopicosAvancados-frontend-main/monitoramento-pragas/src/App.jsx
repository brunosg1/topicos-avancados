import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CadastroPage from "./pages/CadastroPage";
import OcorrenciasPage from "./pages/OcorrenciasPage";
import LoginPage from "./pages/LoginPage";
import MonitoramentoPage from "./pages/MonitoramentoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastros" element={<CadastroPage />} />
        <Route path="/monitoramento" element={<MonitoramentoPage />} />
        <Route path="/ocorrencias" element={<OcorrenciasPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;