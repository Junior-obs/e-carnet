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
      const res = await fetch("http://192.168.1.16:5000/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('e_carnet_user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        // Vérifier si une redirection est en attente
        const redirect = localStorage.getItem('redirect_after_login');
        if (redirect) {
          localStorage.removeItem('redirect_after_login');
          window.location.href = redirect;
        }

        return { success: true, role: data.user.role };
      }
      return { success: false, error: data.message };
    } catch (e) {
      return { success: false, error: "Serveur non joignable" };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch("http://192.168.1.16:5000/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          date_naissance: userData.dateNaissance,
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
    localStorage.removeItem('token');
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);