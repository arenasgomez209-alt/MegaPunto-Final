import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('megapunto_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('megapunto_token') || null);
  const [loading, setLoading] = useState(false);

  // Check token / restore profile on start
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('megapunto_token');
      if (savedToken) {
        const res = await authAPI.getProfile();
        if (res.ok && res.data.success) {
          setCurrentUser(res.data.user);
          localStorage.setItem('megapunto_user', JSON.stringify(res.data.user));
        } else {
          // Token expired or invalid
          logout();
        }
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const res = await authAPI.login({ email, password });
    setLoading(false);

    if (res.ok && res.data.success) {
      const { token: receivedToken, user } = res.data;
      setToken(receivedToken);
      setCurrentUser(user);
      localStorage.setItem('megapunto_token', receivedToken);
      localStorage.setItem('megapunto_user', JSON.stringify(user));
      return { success: true, user, message: res.data.message };
    } else {
      return {
        success: false,
        message: res.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    const res = await authAPI.register(userData);
    setLoading(false);

    if (res.ok && res.data.success) {
      const { token: receivedToken, user } = res.data;
      setToken(receivedToken);
      setCurrentUser(user);
      localStorage.setItem('megapunto_token', receivedToken);
      localStorage.setItem('megapunto_user', JSON.stringify(user));
      return { success: true, user, message: res.data.message };
    } else {
      return {
        success: false,
        message: res.data?.message || 'Error al procesar el registro.'
      };
    }
  };

  const updateUserProfile = async (profileData) => {
    setLoading(true);
    const res = await authAPI.updateProfile(profileData);
    setLoading(false);

    if (res.ok && res.data.success) {
      const updatedUser = res.data.user;
      setCurrentUser(updatedUser);
      localStorage.setItem('megapunto_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser, message: res.data.message };
    } else {
      return { success: false, message: res.data?.message || 'Error al actualizar el perfil.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('megapunto_token');
    localStorage.removeItem('megapunto_user');
  };

  const isAdmin = currentUser?.rol === 'Administrador';
  const isEmpleado = currentUser?.rol === 'Empleado';
  const isCliente = currentUser?.rol === 'Cliente' || (!isAdmin && !isEmpleado && !!currentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        login,
        register,
        updateUserProfile,
        logout,
        isAdmin,
        isEmpleado,
        isCliente,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
