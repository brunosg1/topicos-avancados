// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSeedling, FaHome, FaTractor, FaBug } from "react-icons/fa"; // Certifique-se de importar todos os ícones necessários

const Sidebar = ({ activeLink }) => {
    return (
        <aside className="w-60 bg-white border-r shadow-md p-4 space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center gap-2">
                <FaSeedling /> AgroSistema
            </h2>
            <nav className="space-y-3">
                <Link
                    to="/login"
                    className={`flex items-center gap-2 text-green-700 hover:font-semibold ${activeLink === '/login' ? 'font-semibold' : ''}`}
                >
                    <FaHome /> Logout
                </Link>
                <Link
                    to="/cadastros" 
                    className={`flex items-center gap-2 text-green-700 hover:font-semibold ${activeLink === '/cadastro' ? 'font-semibold' : ''}`}
                >
                    <FaHome /> Cadastro
                </Link>
                <Link
                    to="/monitoramento"
                    className={`flex items-center gap-2 text-green-700 hover:font-semibold ${activeLink === '/monitoramento' ? 'font-semibold' : ''}`}
                >
                    <FaTractor /> Monitoramento
                </Link>
                <Link
                    to="/ocorrencias"
                    className={`flex items-center gap-2 text-green-700 hover:font-semibold ${activeLink === '/ocorrencias' ? 'font-semibold' : ''}`}
                >
                    <FaBug /> Ocorrências
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;