import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, 
  FaTint, FaFileMedical, FaShieldAlt, FaCamera,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Profil() {
  const { user, isPatient, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* --- SECTION EN-TÊTE (HEADER) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Bannière de fond décorative */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-end -mt-16 space-y-4 md:space-y-0 md:space-x-6">
            {/* Photo de profil avec bouton d'édition */}
            <div className="relative group">
              <div className="w-32 h-32 bg-white rounded-2xl p-1 shadow-2xl">
                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {user?.photo ? (
                    <img src={user.photo} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-5xl text-blue-300" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-transform hover:scale-110">
                <FaCamera size={14} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">
                {user?.prenom} {user?.nom}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {isPatient ? 'Patient' : 'Médecin'}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  Compte Vérifié
                </span>
              </div>
            </div>

            <button 
              onClick={logout}
              className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt /> Déconnexion
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE : INFOS DE CONTACT --- */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaUser className="text-blue-600" /> Informations Personnelles
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem icon={<FaEnvelope />} label="Email Professionnel" value={user?.email} />
              <InfoItem icon={<FaPhone />} label="Téléphone" value={user?.telephone || "77 000 00 00"} />
              <InfoItem icon={<FaCalendarAlt />} label="Date de naissance" value={user?.dateNaissance || "Non renseignée"} />
              <InfoItem icon={<FaShieldAlt />} label="ID Patient" value={`#${user?.id?.toString().slice(-6) || 'N/A'}`} />
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : SANTÉ (Si Patient) --- */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-sm p-6 border border-blue-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaFileMedical className="text-blue-600" /> Dossier Médical
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                    <FaTint />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Groupe Sanguin</span>
                </div>
                <span className="text-xl font-black text-gray-800">{user?.groupeSanguin || 'A+'}</span>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase">Numéro de Dossier</span>
                <p className="text-lg font-mono font-bold text-blue-700 mt-1">
                  SN-CARNET-2026-{user?.id?.toString().slice(-4) || '0000'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Petit composant utilitaire pour les items d'information
function InfoItem({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-gray-400">
        <span className="text-xs">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-gray-800 font-semibold">{value}</p>
    </div>
  );
}

export default Profil;