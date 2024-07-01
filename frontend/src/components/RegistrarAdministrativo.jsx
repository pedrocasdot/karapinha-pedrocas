import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Modal from 'react-modal';
import { registerUser, sendEmail } from '../services/apiService';
import { customStyles } from '../services/custom';

Modal.setAppElement('#root');

const RegistrarAdministrativo = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    bi: '',
    username: '',
    foto: '',
    password: '',
    confirmPassword: '',
    telemovel: '',
    enderecoEmail: '',
    status: false,
    tipoUsuario: 2,
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
    if (!formData.nomeCompleto) newErrors.nomeCompleto = 'Nome Completo é obrigatório';
    if (!formData.enderecoEmail) newErrors.enderecoEmail = 'Email é obrigatório';
    if (!formData.telemovel) newErrors.telemovel = 'Telemóvel é obrigatório';
    if (!formData.bi) newErrors.bi = 'Bilhete de Identidade é obrigatório';
    if (!formData.username) newErrors.username = 'Username é obrigatório';
    if (!formData.password) newErrors.password = 'Password é obrigatório';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords não coincidem';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTimeout(() => setErrors({}), 3000);
    } else {
      let userData = { ...formData };
      delete userData.confirmPassword;
      try {
        const response = await registerUser(userData);
        setModalMessage('A conta do administrativo foi registrada com sucesso!');
        setModalIsOpen(true);
        setTimeout(() => setModalIsOpen(false), 3000);
        sendEmail(response);
      } catch (error) {
        console.error('Erro ao criar a conta:', error.message);
        setModalMessage('Erro ao criar a conta, por favor tente novamente');
        setModalIsOpen(true);
        setTimeout(() => setModalIsOpen(false), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center  py-6">
      <div className="w-[100%]  bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-custombrown">Registrar Administrativo</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {previewImage && (
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-48 w-48 rounded-full object-cover mb-4"
              />
            </div>
          )}
          <div className="w-full">
            <label className="block text-custombrown text-sm font-bold mb-2">Nome Completo</label>
            <input
              type="text"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nome Completo"
            />
            {errors.nomeCompleto && <p className="text-red-500 text-xs italic">{errors.nomeCompleto}</p>}
          </div>
          <div className="w-full">
            <label className="block text-custombrown text-sm font-bold mb-2">Endereço de Email</label>
            <input
              type="email"
              name="enderecoEmail"
              value={formData.enderecoEmail}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email"
            />
            {errors.enderecoEmail && <p className="text-red-500 text-xs italic">{errors.enderecoEmail}</p>}
          </div>
          <div className="w-full">
            <label className="block text-custombrown text-sm font-bold mb-2">Telemóvel</label>
            <input
              type="text"
              name="telemovel"
              value={formData.telemovel}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Telemóvel"
            />
            {errors.telemovel && <p className="text-red-500 text-xs italic">{errors.telemovel}</p>}
          </div>
          <div className="w-full">
            <label className="block text-custombrown text-sm font-bold mb-2">Foto</label>
            <input
              type="file"
              name="foto"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.foto && <p className="text-red-500 text-xs italic">{errors.foto}</p>}
          </div>
          <div className="w-full">
            <label className="block text-custombrown text-sm font-bold mb-2">Bilhete de Identidade</label>
            <input
              type="text"
              name="bi"
              value={formData.bi}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Bilhete de Identidade"
            />
            {errors.bi && <p className="text-red-500 text-xs italic">{errors.bi}</p>}
          </div>
          <div className="w-full">
            <label className="block text-custombrown text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Username"
            />
            {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
          </div>
          <div className="w-full">
            <label className="block text-custombrown text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <label className="block text-custombrown text-sm font-bold mb-2">Confirmação da Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cadastrar
            </button>
          </div>
        </form>
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

export default RegistrarAdministrativo;

