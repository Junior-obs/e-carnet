import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- LOGIQUE D'INSCRIPTION ---
  const register = async (userData) => {
    try {
      // On simule une attente réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On sauvegarde l'utilisateur pour la session de démo (sans le password)
      const { password, confirmPassword, ...userToSave } = userData;
      localStorage.setItem('registeredUser', JSON.stringify(userToSave));
      
      return { success: true };
    } catch (err) {
      return { success: false, error: "Erreur lors de la création du compte" };
    }
  };

  // --- LOGIQUE DE CONNEXION ---
  const login = async (email, password) => {
    try {
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 800));

      // On vérifie si c'est l'utilisateur qui vient de s'inscrire
      const savedUser = JSON.parse(localStorage.getItem('registeredUser'));
      let userData;

      if (savedUser && savedUser.email === email) {
        userData = { ...savedUser, id: 'USR-' + Date.now() };
      } else {
        // Fallback démo par défaut si on n'est pas passé par Register
        userData = {
          id: 'DEMO-' + Date.now(),
          email: email,
          prenom: "Utilisateur",
          nom: "Démo",
          role: email.includes('@cabinet.sn') ? 'medecin' : 'patient',
          telephone: "77 000 00 00"
        };
      }

      const fakeToken = 'fake-jwt-' + btoa(email);
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(fakeToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      setError("Email ou mot de passe incorrect");
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isPatient: user?.role === 'patient',
    isMedecin: user?.role === 'medecin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;