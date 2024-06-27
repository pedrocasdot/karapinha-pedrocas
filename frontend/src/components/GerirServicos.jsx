import React, { useState, useEffect } from 'react';
import { getAllCategories, registerCategory, registerService, getCategoryById } from '../services/apiService';
import AddCategoryModal from './AddCategoryModal'; // Importando o modal criado

const GerirServicos = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState('');
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesFromApi = await getAllCategories();
        setCategories(categoriesFromApi);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    }

    fetchCategories();
  }, []);

  const handleAddService = async () => {
    console.log(categories)
    try {
      const newService = {
        name,
        category,
        price
      };
      // const category = await getCategoryById();
      const newServiceObject = {
        serviceName: newService.name,
        categoryId: categories.find(cat => cat.name.toLowerCase() === category.toLowerCase()).id,
        price: newService.price,
        status: true
      };
      await registerService(newServiceObject)
      setServices([...services, newService]);
      setName('');
      setCategory('');
      setPrice('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteService = (index) => {
    const updatedServices = services.filter((service, i) => i !== index);
    setServices(updatedServices);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const addCategory = async (newCategory) => {
    try {
      await registerCategory(newCategory);
      const allCat = await getAllCategories();
      setCategories(allCat);
      setCategory(newCategory.name);
      closeModal();
    } catch (error) {
      
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Gestão de Serviços</h1>
        <div>
          <div className="mb-4 overflow-y-auto" style={{ maxHeight: '400px', width: '1100px' }}>
            <label className="block text-gray-700 text-sm font-bold mb-2">Serviços Registrados:</label>
            <table className="min-w-full divide-gray-200" style={{ width: '800px' }}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service, index) => (
                  <tr key={index}>
                    <td className="px-8 py-4 whitespace-nowrap">{service.name}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{service.category}</td>
                    <td className="px-8 py-4 whitespace-nowrap">{service.price}</td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteService(index)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        Excluir
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nome do Serviço:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Categoria:</label>
                  <div className="flex">
                    <select
                      value={category}
                      onChange={handleCategoryChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={openModal}
                      className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-0 px-2 ml-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      + Nova
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
                <input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={handleAddService}
            className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
          >
            Registrar
          </button>
        </div>

        {modalOpen && (
          <AddCategoryModal
            closeModal={closeModal}
            addCategory={addCategory}
          />
        )}
      </div>
    </div>
  );
};

export default GerirServicos;