// ResetPassword.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { UserContext } from '../services/UserContext';

 import { updateUser } from '../services/apiService';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  let { user } = useContext(UserContext);

  const handleGoHome = () => {
    navigate('/');
  };
  console.log(user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      // await resetPassword(user.username, newPassword);
      user.password = newPassword;
      user.status = true;
      const userUpdated = await updateUser(user);
      console.log(userUpdated);
      navigate('/');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Error resetting password, please try again');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Redefinir Senha</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nova Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nova Password"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirmação da Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirmação da Password"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-custombrown hover:bg-custombrown1 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Redefinir Senha
            </button>
            <FiArrowLeft
              className="text-custombrown1 cursor-pointer mr-2 mt-5"
              onClick={handleGoHome}
              size={20}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
