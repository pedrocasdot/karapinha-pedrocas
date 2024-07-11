import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../services/UserContext';
import GerirProfissionais from './GerirProfissinais';
import GerirServicos from './GerirServicos';

import DashboardAdmin from './DashboardAdmin';
import ConfirmarMarcacoes from './ConfirmarMarcacoes';
import ConsultarAgendaMensal from './ConsultarAgendaMensal'; // Importar o novo componente
import sobre from '../assets/images/whychoose2.jpg';
import { getAllCategories } from '../services/apiService';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Admnistrativo = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div
      data-aos="fade-in"
      className="flex h-screen w-screen bg-gray-100"
      style={{ backgroundImage: `url(${sobre})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-gray-800 text-gray-100 w-64 flex flex-col items-center">
        <div className="p-6">
          <h1 className="text-xl font-bold mb-2">Dashboard Administrativo</h1>
          <p className="text-lg">Bem-vindo!</p>
        </div>
        <nav className="flex-1">
          <button
            onClick={() => handlePageChange('dashboard')}
            className={`block p-4 text-lg focus:bg-gray-700 focus:text-white transition duration-300 ${currentPage === 'dashboard' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handlePageChange('profissionais')}
            className={`block p-4 text-lg focus:bg-gray-700 focus:text-white transition duration-300 ${currentPage === 'profissionais' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            Gerir Profissionais
          </button>
          <button
            onClick={() => handlePageChange('servicos')}
            className={`block p-4 text-lg focus:bg-gray-700 focus:text-white transition duration-300 ${currentPage === 'servicos' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            Gerir Serviços
          </button>
          <button
            onClick={() => handlePageChange('marcacoes')}
            className={`block p-4 text-lg focus:bg-gray-700 focus:text-white transition duration-300 ${currentPage === 'marcacoes' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            Gerir Marcações
          </button>
          <button
            onClick={() => handlePageChange('agenda')}
            className={`block p-4 text-lg focus:bg-gray-700 focus:text-white transition duration-300 ${currentPage === 'agenda' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
          >
            Consultar Agenda Mensal
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-4 mx-4 transition duration-300"
          >
            Logout
          </button>
        </nav>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="w-full h-full bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
          {currentPage === 'dashboard' && <DashboardAdmin />}
          {currentPage === 'profissionais' && <GerirProfissionais />}
          {currentPage === 'servicos' && <GerirServicos />}
          {currentPage === 'marcacoes' && <ConfirmarMarcacoes />}
          {currentPage === 'agenda' && <ConsultarAgendaMensal />}
        </div>
      </div>
    </div>
  );
};

export default Admnistrativo;
