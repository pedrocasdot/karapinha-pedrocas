import React, { useState, useContext } from 'react';
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiUser } from 'react-icons/fi';
import { UserContext } from '../services/UserContext';
import { updateUser } from '../services/apiService';
import Modal from 'react-modal';
import { customStyles } from '../services/custom';
import sobre from '../assets/images/about-1.jpg';

import 'tailwindcss/tailwind.css'; // Import Tailwind CSS

Modal.setAppElement('#root');

const UserProfileForm = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    id: user.id,
    nomeCompleto: user.nomeCompleto || '',
    enderecoEmail: user.enderecoEmail || '',
    telemovel: user.telemovel || '',
    bi: user.bi || '',
    username: user.username || '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      if (files && files[0]) {
        setPreviewImage(URL.createObjectURL(files[0]));
      } else {
        setPreviewImage(null);
      }
    }
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.password && !formData.confirmPassword)
      newErrors.confirmPassword = 'Deve confirmar a password';
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords não coincidem';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      let userData = { ...formData };
      delete userData.confirmPassword;
      try {
        Object.keys(userData).forEach((key) => {
          if (userData[key] === '' || userData[key] === null || userData[key] === undefined) {
            userData[key] = user[key];
          }
        });
        await updateUser(userData);
        setModalMessage('Dados atualizados com sucesso');
        setModalSuccess(true);
        setModalIsOpen(true);
        setTimeout(() => setModalIsOpen(false), 3000);
      } catch (error) {
        setModalMessage('Erro ao atualizar perfil');
        setModalSuccess(false);
        setModalIsOpen(true);
        setTimeout(() => setModalIsOpen(false), 3000);
      }
    }
  };

  return (
    <div className="container flex justify-center items-center bg-gray-100  rounded-lg " style={{ backgroundImage: `url(${sobre})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
     <h1 className="text-2xl font-bold text-white"><FiUser size={70} /></h1>
     
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full  p-12 bg-white rounded-lg shadow-lg"
      >
        {previewImage && (
          <div className="col-span-1 lg:col-span-2 flex justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-64 w-64 rounded-full object-cover mb-6 border-2 border-gray-200"
            />
          </div>
        )}

        <div className="w-full">
          <label className="block text-gray-700 text-lg font-bold mb-2">Nome Completo</label>
          <input
            type="text"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleChange}
            className="transition duration-500 ease-in-out transform hover:scale-105 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nome Completo"
          />
          {errors.nomeCompleto && <p className="text-red-500 text-xs italic">{errors.nomeCompleto}</p>}
        </div>

        <div className="w-full">
          <label className="block text-gray-700 text-lg font-bold mb-2">Endereço de Email</label>
          <input
            type="email"
            name="enderecoEmail"
            value={formData.enderecoEmail}
            onChange={handleChange}
            className="transition duration-500 ease-in-out transform hover:scale-105 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
          />
          {errors.enderecoEmail && <p className="text-red-500 text-xs italic">{errors.enderecoEmail}</p>}
        </div>

        <div className="w-full">
          <label className="block text-gray-700 text-lg font-bold mb-2">Telemóvel</label>
          <input
            type="text"
            name="telemovel"
            value={formData.telemovel}
            onChange={handleChange}
            className="transition duration-500 ease-in-out transform hover:scale-105 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Telemóvel"
          />
          {errors.telemovel && <p className="text-red-500 text-xs italic">{errors.telemovel}</p>}
        </div>

        <div className="w-full">
          <label className="block text-gray-700 text-lg font-bold mb-2">Foto</label>
          <input
            type="file"
            name="foto"
            onChange={handleChange}
            className="transition duration-500 ease-in-out transform hover:scale-105 shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.foto && <p className="text-red-500 text-xs italic">{errors.foto}</p>}
        </div>

        <div className="w-full">
          <label className="block text-gray-700 text-lg font-bold mb-2">Bilhete de Identidade</label>
          <input
            type="text"
            name="bi"
            value={formData.bi}
            onChange={handleChange}
            className="transition duration-500 ease-in-out transform hover:scale-105 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Bilhete de Identidade"
          />
          {errors.bi && <p className="text-red-500 text-xs italic">{errors.bi}</p>}
        </div>

        <div className="w-full">
          <label className="block text-gray-700 text-lg font-bold mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="transition duration-500 ease-in-out transform hover:scale-105 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Username"
          />
          {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
        </div>

        <div className="w-full">
          <label className="block text-gray-700 text-lg font-bold mb-2">Nova Palavra-passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="transition duration-500 ease-in-out transform hover:scale-105 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Password"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
              {showPassword ? (
                <FiEyeOff
                  className="text-gray-700 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FiEye
                  className="text-gray-700 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>
          {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
        </div>

        <div className="w-full">
          <label className="block text-gray-700 text-lg font-bold mb-2">Confirmar Nova Palavra-passe</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="transition duration-500 ease-in-out transform hover:scale-105 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirmação da Password"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
              {showConfirmPassword ? (
                <FiEyeOff
                  className="text-gray-700 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              ) : (
                <FiEye
                  className="text-gray-700 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </div>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
        </div>

        <div className="col-span-2 flex items-center justify-center">
          <button
            type="submit"
            className="transition duration-500 ease-in-out transform hover:scale-105 bg-custombrown hover:bg-custombrown1 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Salvar Dados
          </button>
        </div>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Modal de Feedback"
      >
        <div className="text-center">
          {modalSuccess ? (
            <FiCheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
          ) : (
            <FiAlertCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
          )}
          <p>{modalMessage}</p>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfileForm;
