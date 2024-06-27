import React, { useContext,useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Marcacao from './components/Marcacao'
import Auth from './components/Auth'
import Header from './components/Header'
import Home from './components/Home'
import Dashboard from './components/DashboardUser';
import Admnistrativo from './components/Admnistrativo';
import Admin from './components/Admin'
import { UserProvider, UserContext } from './services/UserContext';
import RedefinirSenha from './components/RedefinirSenha';
import ProtectedRoute from './services/ProtectedRoute'



const App = () => {

  const { user } = useContext(UserContext);
//  const navigate = useNavigate();
// console.log(user);
// useEffect(() => {
//   if (user) {
//     switch (user.role) {
//       case 'user':
//         navigate('/dashboard');
//         break;
//       case 'administrativo':
//         navigate('/administrativo');
//         break;
//       case 'admin':
//         navigate('/administrador');
//         break;
//       default:
//         break;
//     }
//   }
// }, [user, navigate]);


  return (
    // <UserProvider>
    <Router>
      <Routes>

        {!user && <Route path="/login" element={<Auth />} />}
        {!user && <Route path="/" element={<Home />} />}

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['administrativo']} />}>
          <Route path="/administrativo/*" element={<Admnistrativo />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/administrador/*" element={<Admin />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['administrativo']} />}>
          <Route path="/redefinirsenha/*" element={<RedefinirSenha />} />
        </Route>
      </Routes>
    </Router>
    // </UserProvider>
  );
}

export default App
