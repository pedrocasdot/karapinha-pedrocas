import React, { useState, useEffect, useContext} from 'react';
import Marcacao from './Marcacao';
import { useNavigate } from 'react-router-dom';
import Perfil from './Perfil';
import GerirProfissionais from './GerirProfissinais';
import GerirServicos from './GerirServicos';
import ConfirmarMarcacoes from './ConfirmarMarcacoes';
import { getAllCategories } from '../services/apiService';
import AOS from 'aos';
import { UserContext } from '../services/UserContext';
import 'aos/dist/aos.css';


const Admnistrativo = () => {
  const [currentPage, setCurrentPage] = useState(null);
  const navigate = useNavigate();
  const {setUser } = useContext(UserContext);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });

    // Função para buscar serviços
   
  }, []);
  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };
  return (
    <div data-aos="fade-in" className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-800 text-gray-100 w-64 flex flex-col items-center">
        <div className="p-4">
          <h1 className="text-3xl font-bold">Dashboard Admnistrativo</h1>
          <p className="text-sm">Bem-vindo!</p>
        </div>
        <nav className="flex-1">
          <button onClick={() => handlePageChange('profissionais')} className="block p-4 hover:bg-gray-700 transition duration-300">Gerir Profissionais</button>
          <button onClick={() => handlePageChange('servicos')} className="block p-4 hover:bg-gray-700 transition duration-300">Gerir Serviços</button>
          <button onClick={() => handlePageChange('marcacoes')} className="block p-4 hover:bg-gray-700 transition duration-300">Gerir Marcação</button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-4 mx-4 transition duration-300">Logout</button>

        </nav>
      </div>

      <div className="flex-1 p-1">
        <div className="max-w-screen-lg mx-auto">
          <div id='content' className="flex"> {/* Alteração aqui */}
            {currentPage === 'profissionais' && <GerirProfissionais />}
            {currentPage === 'servicos' && <GerirServicos />}
            {currentPage === 'marcacoes' && <ConfirmarMarcacoes />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admnistrativo;
