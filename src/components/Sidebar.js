import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaFileMedical, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaUser,
  FaTimes,
  FaUserInjured,
  FaNotesMedical,
  FaStethoscope,
  FaChevronRight
} from 'react-icons/fa';

function Sidebar({ isOpen, userRole, onClose }) {
  const location = useLocation();

  // On définit la couleur principale basée sur ton logo (Vert Émeraude)
  const brandColor = "emerald"; // Correspond au vert du logo

  if (!isOpen) return null;

  const getMenuItems = () => {
    if (userRole === 'medecin') {
      return [
        { path: '/', icon: FaHome, label: 'Tableau de bord' },
        { path: '/patients', icon: FaUserInjured, label: 'Mes Patients' },
        { path: '/consultations', icon: FaStethoscope, label: 'Consultations' },
        { path: '/rendez-vous', icon: FaCalendarAlt, label: 'Agenda' },
        { path: '/messagerie', icon: FaEnvelope, label: 'Messagerie' },
        { path: '/profil', icon: FaUser, label: 'Mon Profil' },
      ];
    } else {
      return [
        { path: '/', icon: FaHome, label: 'Tableau de bord' },
        { path: '/dossier-medical', icon: FaFileMedical, label: 'Mon Dossier' },
        { path: '/ordonnances', icon: FaNotesMedical, label: 'Mes Ordonnances' },
        { path: '/rendez-vous', icon: FaCalendarAlt, label: 'Rendez-vous' },
        { path: '/messagerie', icon: FaEnvelope, label: 'Messagerie' },
        { path: '/profil', icon: FaUser, label: 'Profil' },
      ];
    }
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay pour mobile avec flou */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-100 z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* HEADER AVEC TON LOGO */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="E-CARNET Logo" 
                  className="w-12 h-12 object-contain"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-800 leading-none tracking-tighter">
                  E-CARNET
                </span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">
                  Santé Médical
                </span>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* NAVIGATION */}
          <nav className="flex-1 px-4 space-y-8 overflow-y-auto mt-4">
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Menu Principal</p>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                          active
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                            : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`text-lg ${active ? 'text-white' : 'group-hover:text-emerald-600 transition-colors'}`} />
                          <span className={`font-bold text-sm ${active ? 'text-white' : 'text-slate-600'}`}>{item.label}</span>
                        </div>
                        {active && <FaChevronRight className="text-[10px] opacity-50" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
          
          {/* FOOTER : BADGE DE RÔLE (Style Premium) */}
          <div className="p-6">
            <div className={`p-4 rounded-[2rem] border-2 transition-all ${
              userRole === 'medecin' 
                ? 'bg-blue-50/50 border-blue-100' 
                : 'bg-emerald-50/50 border-emerald-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${
                  userRole === 'medecin' ? 'bg-blue-500' : 'bg-emerald-500'
                }`}>
                   {userRole === 'medecin' ? <FaStethoscope /> : <FaUser />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Session</span>
                  <span className={`text-sm font-black truncate ${
                    userRole === 'medecin' ? 'text-blue-700' : 'text-emerald-700'
                  }`}>
                    {userRole === 'medecin' ? 'Dr. Praticien' : 'Espace Patient'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;