import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarCheck, FaEnvelope, FaUserCircle, 
  FaSignOutAlt, FaBell, FaSearch, FaArrowRight, FaClock,
  FaShieldAlt, FaPlus, FaEllipsisH
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMedecin = user?.role === 'medecin';

  const rdvData = isMedecin 
    ? [
        { nom: "Mamadou Diop", info: "Suivi Diabète Type 2", heure: "08:30", type: "Urgent", status: "En attente" },
        { nom: "Awa Ndiaye", info: "Consultation Post-Op", heure: "10:00", type: "Normal", status: "Confirmé" }
      ]
    : [
        { nom: "Dr. Babacar Sy", info: "Cardiologue - Clinique Casahous", heure: "14 Mars", type: "RDV", status: "Confirmé" },
        { nom: "Dr. Aminata Fall", info: "Généraliste - Cabinet Médina", heure: "22 Mars", type: "RDV", status: "Rappel" }
      ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-slate-900">
      
      {/* --- NAVBAR --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* LOGO DEPUIS PUBLIC */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-14 h-14 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <img 
                src="/logo.png" 
                alt="E-CARNET Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl leading-none tracking-tighter text-[#28a745]">
                E-CARNET<span className="text-slate-700">SANTÉ</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sénégal É-Santé</span>
            </div>
          </div>

          {/* RECHERCHE */}
          <div className="hidden lg:flex items-center bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-2xl gap-3 w-96 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-50 transition-all">
            <FaSearch className="text-slate-400" />
            <input type="text" placeholder="Rechercher un dossier..." className="bg-transparent outline-none text-sm w-full font-medium" />
          </div>

          <div className="flex items-center gap-5">
            <button className="p-2.5 bg-slate-50 text-slate-500 hover:text-[#28a745] hover:bg-green-50 rounded-xl transition-all relative">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200"></div>

            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-none">{user?.prenom} {user?.nom}</p>
                <p className="text-[10px] font-bold text-[#28a745] uppercase tracking-widest mt-1.5 flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 bg-[#28a745] rounded-full animate-pulse"></span> {user?.role}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-[18px] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-[#28a745] font-black text-lg">
                {user?.prenom?.[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 lg:p-10 flex-1">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 italic">
              Bienvenue, {isMedecin ? 'Docteur' : ''} {user?.prenom}
            </h2>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <FaClock className="text-green-500" /> Lundi 9 Mars 2026 • Dakar
            </p>
          </div>
          
          <button className="flex items-center justify-center gap-2 bg-[#28a745] hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-green-100 transition-all active:scale-95">
            <FaPlus /> {isMedecin ? 'Ajouter une consultation' : 'Prendre un rendez-vous'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-xl font-black text-slate-800 tracking-tight italic underline decoration-green-400 decoration-4 underline-offset-8">Agenda du jour</h3>
                <button className="text-[#28a745] font-bold text-sm hover:bg-green-50 px-4 py-2 rounded-xl transition-colors">
                  Voir tout
                </button>
              </div>

              <div className="p-6 space-y-4">
                {rdvData.map((rdv, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 hover:shadow-lg hover:shadow-green-50 hover:border-green-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:rotate-6 ${rdv.type === 'Urgent' ? 'bg-rose-50 text-rose-500' : 'bg-green-50 text-[#28a745]'}`}>
                        {isMedecin ? <FaUserCircle /> : <FaCalendarCheck />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg group-hover:text-[#28a745] transition-colors">{rdv.nom}</h4>
                        <p className="text-sm font-semibold text-slate-400">{rdv.info}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-700">{rdv.heure}</p>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${rdv.type === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-green-100 text-[#28a745]'}`}>
                        {rdv.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* COLONNE DROITE */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3 italic">
                  <div className="p-2 bg-green-50 rounded-lg text-[#28a745] text-sm"><FaEnvelope /></div>
                  Notifications
                </h3>
                <FaEllipsisH className="text-slate-300" />
              </div>
              
              <div className="space-y-6 text-sm">
                 <p className="text-slate-500 italic text-center py-4">Aucun nouveau message pour le moment.</p>
              </div>
            </div>

            {/* SECTION SECURITE */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative shadow-2xl overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <FaShieldAlt className="text-green-400 text-sm" />
                  <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Protection Active</span>
                </div>
                <h4 className="text-xl font-bold mb-3 tracking-tight text-white">E-CARNET PRIVACY</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                  Vos données médicales sont cryptées et hébergées conformément aux normes de la CDP Sénégal.
                </p>
                <button className="w-full py-3.5 bg-white/5 hover:bg-[#28a745] border border-white/10 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2">
                  Paramètres de sécurité <FaArrowRight className="text-[10px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-10 py-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 border-t border-slate-200/60 mt-10">
        <p className="text-xs font-bold uppercase tracking-widest">© 2026 E-CARNET SANTE MEDICAL • Plateforme Agréée</p>
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="group flex items-center gap-3 px-5 py-2 hover:bg-rose-50 rounded-xl text-slate-500 hover:text-rose-600 font-bold transition-all text-sm"
        >
          <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> 
          Déconnexion sécurisée
        </button>
      </footer>
    </div>
  );
}

export default Dashboard;