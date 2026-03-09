import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// Import des composants
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import HeroSection from './components/HeroSection';

// Import des pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DossierMedical from './pages/DossierMedical';
import RendezVous from './pages/RendezVous';
import Messagerie from './pages/Messagerie';
import Profil from './pages/Profil';

// Import du contexte d'authentification
import { useAuth } from './contexts/AuthContext';

// Import des icônes
import { FaHeartbeat } from 'react-icons/fa';

function App() {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Gestion de la sidebar sur mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Message de bienvenue à la connexion
  useEffect(() => {
    if (isAuthenticated && user) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center z-10">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-white p-6 rounded-full shadow-2xl mb-6 inline-block"
          >
            <FaHeartbeat className="text-6xl text-blue-600" />
          </motion.div>
          <h1 className="text-white text-2xl font-bold animate-pulse">Chargement de votre espace santé...</h1>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        
        {/* Notification de Bienvenue */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div 
              initial={{ y: -100, x: '-50%' }} 
              animate={{ y: 20, x: '-50%' }} 
              exit={{ y: -100, x: '-50%' }}
              className="fixed left-1/2 z-[100] bg-white border-l-4 border-blue-600 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-4"
            >
              <FaHeartbeat className="text-blue-600 animate-pulse text-xl" />
              <span className="font-bold text-slate-800">Bienvenue, {user?.prenom || 'Utilisateur'} ! 👋</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header - Affiché uniquement si connecté */}
        {isAuthenticated && (
          <div className="fixed top-0 left-0 right-0 z-40">
            <Header userRole={user?.role} onLogout={logout} toggleSidebar={toggleSidebar} />
          </div>
        )}
        
        <div className={`flex flex-1 ${isAuthenticated ? 'pt-16' : ''}`}>
          
          {/* Sidebar - Affichée uniquement si connecté */}
          <AnimatePresence>
            {isAuthenticated && sidebarOpen && (
              <motion.div 
                initial={{ x: -300 }} 
                animate={{ x: 0 }} 
                exit={{ x: -300 }}
                className="fixed left-0 top-16 bottom-0 z-30"
              >
                <Sidebar isOpen={sidebarOpen} userRole={user?.role} onClose={() => setSidebarOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 ${isAuthenticated && sidebarOpen ? 'lg:ml-64' : ''} ${isAuthenticated ? 'p-6' : ''}`}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* --- ROUTES PUBLIQUES --- */}
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
                <Route path="/" element={!isAuthenticated ? <HeroSection /> : <Navigate to="/dashboard" />} />

                {/* --- ROUTES PROTÉGÉES (CORRIGÉES) --- */}
                
                {/* Dashboard générique (celui vers lequel on redirige par défaut) */}
                <Route path="/dashboard" element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <motion.div key="dash" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                      <Dashboard userRole={user?.role} />
                    </motion.div>
                  </PrivateRoute>
                } />

                {/* Ajout des alias pour éviter l'erreur 404 après le login */}
                <Route path="/dashboard-patient" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard-medecin" element={<Navigate to="/dashboard" />} />

                <Route path="/dossier-medical" element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <motion.div key="dossier" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                      <DossierMedical userRole={user?.role} />
                    </motion.div>
                  </PrivateRoute>
                } />

                <Route path="/rendez-vous" element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <motion.div key="rdv" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                      <RendezVous userRole={user?.role} />
                    </motion.div>
                  </PrivateRoute>
                } />

                <Route path="/messagerie" element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <motion.div key="msg" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                      <Messagerie userRole={user?.role} />
                    </motion.div>
                  </PrivateRoute>
                } />

                <Route path="/profil" element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <motion.div key="prof" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                      <Profil userRole={user?.role} />
                    </motion.div>
                  </PrivateRoute>
                } />

                {/* --- GESTION ERREUR 404 --- */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <h1 className="text-9xl font-black text-blue-100 relative">
                      404 
                      <span className="absolute inset-0 flex items-center justify-center text-4xl text-blue-600">Oups !</span>
                    </h1>
                    <p className="text-slate-500 mb-8 font-medium text-xl">La page que vous cherchez n'existe pas ou n'est pas encore créée.</p>
                    <button 
                      onClick={() => window.location.href="/"} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
                    >
                      Retour à l'accueil
                    </button>
                  </div>
                } />
              </Routes>
            </AnimatePresence>
          </main>
        </div>

        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;