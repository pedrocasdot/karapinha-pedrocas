import React, { useState, useContext } from 'react';
import Marcacao from './Marcacao';
import { useNavigate} from 'react-router-dom';
import { UserContext } from '../services/UserContext';
import sobre from '../assets/images/about-1.jpg'

import Perfil from './Perfil';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(null);
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 ">
      {/* Sidebar */}
      <div className="bg-gray-900 text-gray-100 w-64 flex flex-col items-center">
        <div className="p-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm">Bem-vindo! {user?.nomeCompleto}</p>
        </div>
        <nav className="flex-1">
          <button onClick={() => handlePageChange('perfil')} className="block p-4 hover:bg-gray-700 transition duration-300">Alterar perfil</button>
          <button onClick={() => handlePageChange('marcacao')} className="block p-4 hover:bg-gray-700 transition duration-300">Marcações</button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-4 mx-4 transition duration-300">Sair</button>

        </nav>
      </div>

      <div className="flex-1" style={{ backgroundImage: `url(${sobre})` }}>
        <div className="max-w-screen-lg mx-auto">
          <div id='content' className="flex mb-1"> {/* Alteração aqui */}
            {currentPage === 'perfil' && <Perfil />}
            {currentPage === 'marcacao' && <Marcacao />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
