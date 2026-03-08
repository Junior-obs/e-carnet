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
import { FaHeartbeat, FaShieldAlt, FaUserMd, FaCalendarCheck, FaEnvelope, FaFileMedical } from 'react-icons/fa';

function App() {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Gestion de la sidebar sur mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Afficher le message de bienvenue quand l'utilisateur se connecte
  useEffect(() => {
    if (isAuthenticated) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Animation pour les transitions de pages
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        {/* Particules animées */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative text-center z-10">
          {/* Logo animé */}
          <motion.div
            className="flex justify-center mb-8"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="bg-white p-6 rounded-full shadow-2xl">
              <FaHeartbeat className="text-6xl text-blue-600" />
            </div>
          </motion.div>

          {/* Texte de chargement */}
          <motion.h1
            className="text-4xl font-bold text-white mb-4"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            Carnet de Santé
          </motion.h1>

          <motion.p
            className="text-white text-opacity-90 text-lg mb-8"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            Chargement de votre espace personnel...
          </motion.p>

          {/* Barre de progression */}
          <div className="w-64 h-2 bg-white bg-opacity-20 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Message de bienvenue flottant */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <FaHeartbeat />
                </motion.div>
                <span className="font-semibold">
                  Bienvenue, {user?.prenom || user?.nom} ! 👋
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header avec effet de verre */}
        {isAuthenticated && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="fixed top-0 left-0 right-0 z-40"
          >
            <Header 
              userRole={user?.role} 
              onLogout={logout}
              toggleSidebar={toggleSidebar}
            />
          </motion.div>
        )}
        
        <div className={`flex flex-1 ${isAuthenticated ? 'pt-16' : ''}`}>
          {/* Sidebar avec animation */}
          <AnimatePresence mode="wait">
            {isAuthenticated && sidebarOpen && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-16 bottom-0 z-30"
              >
                <Sidebar 
                  isOpen={sidebarOpen} 
                  userRole={user?.role}
                  onClose={() => setSidebarOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay pour mobile */}
          <AnimatePresence>
            {isAuthenticated && sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-20 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>
          
          {/* Contenu principal avec animations de transition */}
          <main className={`flex-1 transition-all duration-300 ${
            isAuthenticated ? 'p-4 md:p-6' : ''
          } ${isAuthenticated && sidebarOpen ? 'lg:ml-64' : ''}`}>
            <div className="container mx-auto max-w-7xl">
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Routes publiques */}
                  <Route 
                    path="/login" 
                    element={
                      isAuthenticated ? 
                      <Navigate to="/" replace /> : 
                      <motion.div
                        key="login"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                      >
                        <Login />
                      </motion.div>
                    } 
                  />
                  
                  <Route 
                    path="/register" 
                    element={
                      isAuthenticated ? 
                      <Navigate to="/" replace /> : 
                      <motion.div
                        key="register"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                      >
                        <Register />
                      </motion.div>
                    } 
                  />

                  {/* Routes protégées */}
                  <Route 
                    path="/" 
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        {!isAuthenticated ? (
                          <motion.div
                            key="hero"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                          >
                            <HeroSection />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="dashboard"
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                          >
                            <Dashboard userRole={user?.role} />
                          </motion.div>
                        )}
                      </PrivateRoute>
                    } 
                  />

                  <Route 
                    path="/dossier-medical" 
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <motion.div
                          key="dossier"
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <DossierMedical userRole={user?.role} />
                        </motion.div>
                      </PrivateRoute>
                    } 
                  />

                  <Route 
                    path="/rendez-vous" 
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <motion.div
                          key="rdv"
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <RendezVous userRole={user?.role} />
                        </motion.div>
                      </PrivateRoute>
                    } 
                  />

                  <Route 
                    path="/messagerie" 
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <motion.div
                          key="messages"
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Messagerie userRole={user?.role} />
                        </motion.div>
                      </PrivateRoute>
                    } 
                  />

                  <Route 
                    path="/profil" 
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <motion.div
                          key="profil"
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Profil userRole={user?.role} />
                        </motion.div>
                      </PrivateRoute>
                    } 
                  />

                  {/* Route 404 avec animation */}
                  <Route 
                    path="*" 
                    element={
                      <motion.div
                        key="404"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="min-h-[60vh] flex items-center justify-center"
                      >
                        <div className="text-center">
                          <motion.div
                            animate={{
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          >
                            <FaHeartbeat className="text-8xl text-blue-600 mx-auto mb-6" />
                          </motion.div>
                          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
                          <p className="text-2xl text-gray-600 mb-8">Page non trouvée</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.history.back()}
                            className="btn-primary"
                          >
                            Retour
                          </motion.button>
                        </div>
                      </motion.div>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Footer avec animation */}
        <AnimatePresence>
          {isAuthenticated && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouton flottant d'aide */}
        <motion.button
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl z-50"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              "0 10px 20px rgba(59, 130, 246, 0.3)",
              "0 15px 30px rgba(139, 92, 246, 0.4)",
              "0 10px 20px rgba(59, 130, 246, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          ?
        </motion.button>

        {/* Particules flottantes en arrière-plan */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(${Math.random()*100 + 100}, ${Math.random()*100 + 100}, 255, 0.1) 0%, transparent 70%)`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 30 - 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;