import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Modal from 'react-modal';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Importando os ícones necessários

import sobre from '../assets/images/whychoose2.jpg'
import { registerUser, login } from '../services/apiService';
import { UserContext } from '../services/UserContext';
import { customStyles } from '../services/custom';

Modal.setAppElement('#root');


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 auth-background bg-cover" style={{ backgroundImage: `url(${sobre})` }}>
      <div className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-opacity-90">
        <h1 className="text-2xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Registro'}</h1>
        {isLogin ? (
          <LoginForm toggleForm={toggleForm} />
        ) : (
          <RegisterForm toggleForm={toggleForm} />
        )}
        <FiArrowLeft
          className="text-custombrown1 cursor-pointer mr-2 mt-5"
          onClick={handleGoHome}
          size={20}
        />
      </div>
    </div>
  );
};
const LoginForm = ({ toggleForm }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const roles = ['user', 'admin', 'administrativo'];
  const handleLogin = async () => {
    try {
      const user = await login(username, password);
      const userData = { ...user, role: roles[user.tipoUsuario] };
      // console.log(userData);
      if (user.tipoUsuario === 0) {
        setUser(userData);
        navigate('/dashboard');
      } else if (user.tipoUsuario === 1) {
        setUser(userData);
        navigate('/administrador');
      } else if (user.tipoUsuario === 2) {
        setUser(userData);
        if (!user.status) {
          navigate('/redefinirsenha');
        } else {
          navigate('/administrativo');
        }
      }
      setModalMessage('Nome de usuário ou senha inválidas');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 1000);

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setModalMessage('Nome de usuário ou senha inválidas!');
      setModalIsOpen(true);
      setTimeout(() => setModalIsOpen(false), 3000);
    }
  };

  return (
    <div>
      <form>
        <div className="mb-4" >
          <label className="block text-gray-700 text-sm font-bold mb-2">Nome de usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Palavra Passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="************"
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
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogin}
          >
            Entrar
          </button>
          <a
            href="#"
            className="inline-block align-baseline font-bold text-sm text-custombrown hover:text-custombrown1"
            onClick={toggleForm}
          >
            Criar uma conta
          </a>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={customStyles}
            contentLabel="Mensagem do Sistema"
          >
            <div>{modalMessage}</div>
          </Modal>
        </div>
      </form>
    </div>
  );
};


const RegisterForm = ({ toggleForm }) => {
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
    tipoUsuario: 0,

  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Define showPassword state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Define showConfirmPassword state

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
      [name]: files ? files[0] : value
    });
  };

  const validateForm = async () => {
    const newErrors = {};
    if (!formData.nomeCompleto) newErrors.nomeCompleto = 'Nome Completo é obrigatório';
    if (!formData.enderecoEmail) newErrors.enderecoEmail = 'Email é obrigatório';
    if (!formData.telemovel) newErrors.telemovel = 'Telemóvel é obrigatório';
    if (!formData.bi) newErrors.bi = 'Bilhete de Identidade é obrigatório';
    if (!formData.username) newErrors.username = 'Username é obrigatório';
    if (!formData.password) newErrors.password = 'Password é obrigatório';
    if (formData.username.length <= 4) newErrors.username = 'Username inválido, deve conter pelo menos 4 caracteres';
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
      let userData = {
        ...formData,
      };
      delete userData.confirmPassword;
      try {
        const response = await registerUser(userData);

        setModalMessage('A sua conta foi criada com sucesso, aguarde pela ativação da conta!');
        setModalIsOpen(true);
        setTimeout(() => setModalIsOpen(false), 3000);
      
        setFormData({
          nomeCompleto: '',
          bi: '',
          username: '',
          foto: '',
          password: '',
          confirmPassword: '',
          telemovel: '',
          enderecoEmail: '',
          status: false,
          tipoUsuario: 0,
        });
        setPreviewImage(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
      } catch (error) {
        console.error('Erro ao registrar:', error);
        let errorMessage = 'Erro ao criar a conta, por favor tente novamente';

        // Verifica se error.errors é um objeto
        if (error.errors && typeof error.errors === 'object') {
          // Constrói uma mensagem de erro a partir do objeto com quebras de linha
          errorMessage = Object.entries(error.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
        } else if (typeof error === 'string') {
          // Se error é uma string, use-a diretamente
          errorMessage = error;
        } else if (error.message) {
          // Se error contém uma mensagem diretamente, use-a
          errorMessage = error.message;
        }

        // Exibe a mensagem de erro com quebras de linha
        setModalMessage(errorMessage);
        setModalIsOpen(true);
        setTimeout(() => setModalIsOpen(false), 8000);


      }
    }
  };

  return (
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Nome Completo</label>
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Endereço de Email</label>
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Telemóvel</label>
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Foto</label>
        <input
          type="file"
          name="foto"
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.foto && <p className="text-red-500 text-xs italic">{errors.foto}</p>}
      </div>
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2">Bilhete de Identidade</label>
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Confirmação da Password</label>
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
      <div className="col-span-1 md:col-span-2 flex items-center justify-between w-full">
        <button
          type="submit"
          className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Registrar
        </button>
        <a
          href="#"
          className="inline-block align-baseline font-bold text-sm text-custombrown hover:text-custombrown1"
          onClick={toggleForm}
        >
          Já tem uma conta? Login
        </a>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={customStyles}
          contentLabel="Mensagem do Sistema"
        >
          <div>{modalMessage}</div>
        </Modal>
      </div>

    </form>
  );
};

export default Auth;
