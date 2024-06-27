import React, { useState } from 'react';

const AddCategoryModal = ({ closeModal, addCategory }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim() !== '') {
      const newCategoryObject = {
        name: newCategory
      };
      addCategory(newCategoryObject);
      setNewCategory('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 w-96 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Adicionar Nova Categoria</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newCategory" className="block text-gray-700 text-sm font-bold mb-2">Nome da Categoria:</label>
            <input
              type="text"
              id="newCategory"
              value={newCategory}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
