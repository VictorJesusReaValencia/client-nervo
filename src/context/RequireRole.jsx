import React, { useContext } from 'react';
import AuthContext from './AuthProvider';
import { Navigate } from 'react-router-dom';

const RequireRole = ({ allowedRoles, children }) => {
  const { auth, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando...</div>;

  // Agrega este console.log para ver el rol actual
  console.log('Rol actual:', auth.role);

  if (!auth.role || !allowedRoles.includes(auth.role)) {
    // Redirige si el rol no está permitido
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireRole;