import React, { useState, useContext } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Marcacao from './Marcacao';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../services/UserContext';
import sobre from '../assets/images/about-1.jpg';
import Perfil from './Perfil';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('marcacao');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100" style={{ backgroundImage: `url(${sobre})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Sidebar */}
      <div className={`bg-gray-900 text-gray-100 flex flex-col items-center transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className={`p-4 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm">Bem-vindo! {user?.nomeCompleto}</p>
        </div>
        <nav className={`flex-1 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <button onClick={() => handlePageChange('perfil')} className="block p-4 hover:bg-gray-700 transition duration-300">Alterar perfil</button>
          <button onClick={() => handlePageChange('marcacao')} className="block p-4 hover:bg-gray-700 transition duration-300">Marcações</button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-4 mx-4 transition duration-300">Sair</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h2 className="text-2xl font-semibold text-white">{currentPage === 'perfil' ? 'Perfil' : currentPage === 'marcacao' ? 'Marcações' : 'Dashboard'}</h2>
        </div>
        <div className="w-full h-full bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
          {currentPage === 'perfil' && <Perfil />}
          {currentPage === 'marcacao' && <Marcacao />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
