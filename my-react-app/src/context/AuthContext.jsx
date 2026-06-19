import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken, isLoggedIn } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    if (isLoggedIn()) setLoggedIn(true);
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loggedIn, setLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
