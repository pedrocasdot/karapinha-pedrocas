import React, { useState, useEffect } from 'react';
import { getAllUsers, ativarConta, desativarConta } from '../services/apiService';
import { customStyles } from '../services/custom';
import Modal from 'react-modal';
import ClipLoader from 'react-spinners/ClipLoader'; // Import spinner component

Modal.setAppElement('#root');

const GerirContasClientes = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  const handleActivateClient = async (index) => {
    setLoading(true); // Start loading
    const updatedClients = [...filteredClients];
    updatedClients[index].status = true;
    try {
      const client = updatedClients[index];
      await ativarConta(client.id);
      setModalMessage('A conta do usuário foi ativada/desbloquada com sucesso.');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
      // Update the main clients list
      const updatedAllClients = clients.map(c => c.id === client.id ? client : c);
      setClients(updatedAllClients);
      setFilteredClients(updatedClients);
    } catch (error) {
      setModalMessage('Não foi possível ativar a conta do usuário.');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
      console.error('Erro ao ativar a conta do usuário:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleBlockClient = async (index) => {
    setLoading(true); // Start loading
    const updatedClients = [...filteredClients];
    updatedClients[index].status = false;
    try {
      const client = updatedClients[index];
      await desativarConta(client.id);
      setModalMessage('A conta do usuário foi bloqueada/desativada com sucesso.');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
      // Update the main clients list
      const updatedAllClients = clients.map(c => c.id === client.id ? client : c);
      setClients(updatedAllClients);
      setFilteredClients(updatedClients);
    } catch (error) {
      console.log("Erro ao bloquear o usuario: ", error);
      setModalMessage('Não foi possível bloquear/desativar a conta do usuário.');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();
        const filteredUsers = users.filter(user => user.tipoUsuario === 0);
        setClients(filteredUsers);
        setFilteredClients(filteredUsers);
      } catch (error) {
        console.error('Erro ao buscar usarios:', error);
      }
    }
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchTerm(search);
    if (search === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.nomeCompleto.toLowerCase().includes(search) ||
        client.enderecoEmail.toLowerCase().includes(search)
      );
      setFilteredClients(filtered);
    }
  };

  return (
    <div className="flex justify-center items-start h-screen mt-4 ">
      <div className="container mx-auto mt-4 p-4 bg-white rounded-lg shadow-md">
        <header className="w-full bg-gray-800 text-white p-4 rounded-t-lg">
          <h1 className="text-xl font-bold">Gerir Contas de Clientes</h1>
        </header>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Pesquisar Clientes:</label>
          <input
            type="text"
            placeholder="Pesquisar por nome ou email"
            value={searchTerm}
            onChange={handleSearch}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
          <label className="block text-gray-700 text-sm font-bold mb-2">Contas de Clientes:</label>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client, index) => (
                <tr key={client.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{client.nomeCompleto}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.enderecoEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.status ? "Ativa" : "Desativada"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loading ? (
                      <ClipLoader size={25} color={"#123abc"} loading={loading} />
                    ) : (
                      <>
                        {client.status === false && (
                          <button
                            onClick={() => handleActivateClient(index)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                          >
                            Ativar
                          </button>
                        )}
                        {client.status === true && (
                          <button
                            onClick={() => handleBlockClient(index)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                          >
                            Bloquear
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={customStyles}
          contentLabel="Mensagem do Sistema"
        >
          <div>{modalMessage}</div>
        </Modal>
      </div>
    </div>
  );
};

export default GerirContasClientes;
