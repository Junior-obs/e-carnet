import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('e_carnet_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('e_carnet_user', JSON.stringify(data.user));
        return { success: true, role: data.user.role };
      }
      return { success: false, error: data.message };
    } catch (e) {
      return { success: false, error: "Serveur non joignable" };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            date_naissance: userData.dateNaissance, // On envoie avec l'underscore pour le SQL
            specialite: userData.specialite
        })
      });
      const data = await res.json();
      return res.ok ? { success: true } : { success: false, error: data.message };
    } catch (e) {
      return { success: false, error: "Erreur serveur" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('e_carnet_user');
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);