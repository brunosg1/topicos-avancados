import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CadastroPage from "./pages/CadastroPage";
import OcorrenciasPage from "./pages/OcorrenciasPage";
import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-green-800 text-white flex gap-4 shadow-md">
        <Link to="/login">Login</Link>
        <Link to="/cadastros">Cadastro</Link>
        <Link to="/ocorrencias">Ocorrências</Link>
      </nav>
      <Routes>
         <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastros" element={<CadastroPage />} />
        <Route path="/ocorrencias" element={<OcorrenciasPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;