import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUser } from '../services/apiService'
const GerirContasClientes = () => {
  const [clients, setClients] = useState([]);

  const handleActivateClient = async (index) => {
    const updatedClients = [...clients];
    updatedClients[index].status = true;
    try {
      const client = updatedClients[index];
      console.log(client);
      await updateUser(client);
      setClients(updatedClients);
    } catch (error) {
      console.log("Erro ao atualizar os dados: ", error);
    }
  };
  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();
        const filteredUsers = users.filter(user => user.tipoUsuario == 0);
        console.log(filteredUsers);
        setClients(filteredUsers);
      } catch (error) {
        console.error('Erro ao buscar usarios:', error);
      }
    }

    fetchUsers();
  }, []);

  const handleBlockClient = async (index) => {
    const updatedClients = [...clients];
    updatedClients[index].status = false;
    try {
      const client = updatedClients[index];
      console.log(client);
      await updateUser(client);
      setClients(updatedClients);
    } catch (error) {
      console.log("Erro ao bloquear o usuario: ", error);
    }
  };



  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <header className="w-full bg-custombrown text-white p-4">
        <h1 className="text-2xl font-bold text-center">Gerir Contas de Clientes</h1>
      </header>
      <div className="container mx-auto mt-4">
        <div className="mb-4 overflow-y-auto" style={{ maxHeight: '400px', width: '1100px' }}>
          <label className="block text-white text-sm font-bold mb-2">Contas de Clientes:</label>
          <table className="min-w-full divide-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client, index) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{client.nomeCompleto}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.enderecoEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.status ? "Ativa" : "Destativada"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GerirContasClientes;
