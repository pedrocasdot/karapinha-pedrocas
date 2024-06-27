// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useContext(UserContext);
    
    if (!user || !allowedRoles.includes(user.role)) {
        if(user){
            switch(user.role){
                case 'admin':
                    return <Navigate to="/admin" />;
                case 'user':
                    return <Navigate to="/user" />;
                case 'administrador':
                    return <Navigate to="/administrador" />;
                default:
                    return <Navigate to="/login" />;
            }
        }
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
