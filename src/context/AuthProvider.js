// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      setLoading(false);
      return;
    }

    const userObj = JSON.parse(user);
    const userID = userObj._id;

    try {
      const request = await fetch(`https://backend-prueba-apel.onrender.com/api/user/profile/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });

      const data = await request.json();

      if (data && data.user) {
        setAuth(data.user); // Debe incluir el campo `role`
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = auth?.role === 'admin';
  const isPremium = auth?.role === 'premium';
  const isGratis = auth?.role === 'gratis';

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
        isAdmin,
        isPremium,
        isGratis,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

