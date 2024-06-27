// AuthGuard.js
import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserContext } from './UserContext';
import Auth from '../components/Auth';
import Home from '../components/Home';

const AuthGuard = () => {
  const { user } = useContext(UserContext);
  console.log(user);
  return (
    <Routes>
      {!user && <Route path="/login" element={<Auth />} />}
      {!user && <Route path="/" element={<Home />} />}
    </Routes>
  );
};

export default AuthGuard;
