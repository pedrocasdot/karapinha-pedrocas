import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GerirContasClientes from './GerirContasClientes';
import RegistrarAdministrativo from './RegistrarAdministrativo';
import img from '../assets/images/whychoose.jpg';
import { UserContext } from '../services/UserContext';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100" style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Sidebar */}
      <div className="bg-gray-800 text-gray-100 w-64 flex flex-col items-center">
        <div className="p-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm">Bem-vindo!</p>
        </div>
        <nav className="flex-1">
          <button onClick={() => handlePageChange('clientes')} className="block p-4 hover:bg-gray-700 transition duration-300">Ativar/Bloquer Contas</button>
          <button onClick={() => handlePageChange('administrativos')} className="block p-4 hover:bg-gray-700 transition duration-300">Cadastrar Admnistrativo</button>
          <button onClick={handleLogout} className="bg-custombrown hover:bg-custombrown1 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-custombrown focus:ring-opacity-50 mt-4 mx-4 transition duration-300">Logout</button>
        </nav>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="w-full h-full bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
            {currentPage === 'clientes' && <GerirContasClientes />}
            {currentPage === 'administrativos' && <RegistrarAdministrativo />}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
