import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaCalendarCheck, FaFileMedicalAlt, 
  FaPills, FaNotesMedical, FaChartLine 
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user, isPatient, isMedecin } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- EN-TÊTE BIENVENUE --- */}
        <header className="mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                👋 Bonjour, <span className="text-blue-600 font-black">{user.prenom} {user.nom}</span> !
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                {isPatient 
                  ? "Bienvenue dans votre carnet de santé numérique personnel." 
                  : "Bienvenue dans votre espace de gestion médicale."}
              </p>
            </div>
            
            <div className={`px-4 py-2 rounded-2xl shadow-sm border ${isMedecin ? 'bg-purple-50 border-purple-100 text-purple-700' : 'bg-blue-50 border-blue-100 text-blue-700'} font-bold flex items-center gap-2`}>
              {isMedecin ? <FaNotesMedical /> : <FaUser />}
              {isMedecin ? 'Espace Praticien' : 'Espace Patient'}
            </div>
          </motion.div>
        </header>

        {/* --- STATISTIQUES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <QuickStat 
            title={isPatient ? "Prochain RDV" : "Patients aujourd'hui"} 
            value={isPatient ? "Demain à 10h30" : "8 consultations"}
            icon={<FaCalendarCheck />}
            color="blue"
          />
          <QuickStat 
            title={isPatient ? "Ordonnances" : "Dossiers en attente"} 
            value={isPatient ? "2 actives" : "3 à valider"}
            icon={<FaPills />} 
            color="purple"
          />
          <QuickStat 
            title="Dernière analyse" 
            value="Il y a 3 jours"
            icon={<FaChartLine />}
            color="green"
          />
        </div>

        {/* --- ACTIONS PRINCIPALES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaFileMedicalAlt className="text-blue-600" /> 
              {isPatient ? "Mon Carnet de Santé" : "Gestion des Patients"}
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center hover:bg-blue-50 cursor-pointer transition-colors">
                <div>
                  <p className="font-bold text-gray-800">Historique des vaccins</p>
                  <p className="text-xs text-gray-500">Dernière mise à jour le 12/01/2026</p>
                </div>
                <span className="text-blue-600 font-bold">Voir</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-lg text-white">
            <h2 className="text-xl font-bold mb-6">Résumé du Profil</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/20 pb-2 text-sm">
                <span className="opacity-80">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Rôle</span>
                <span className="font-bold uppercase text-xs bg-white text-blue-600 px-2 py-1 rounded">
                   {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ title, value, icon, color }) {
  const colors = { blue: "bg-blue-600", purple: "bg-purple-600", green: "bg-green-600" };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
      <div className={`w-14 h-14 ${colors[color]} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-black text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default Dashboard;