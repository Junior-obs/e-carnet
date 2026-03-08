import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaFileMedical, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaUser,
  FaTimes,
  FaChartLine
} from 'react-icons/fa';

function Sidebar({ isOpen, userRole, onClose }) {
  const location = useLocation();

  if (!isOpen) return null;

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Tableau de bord' },
    { path: '/dossier-medical', icon: FaFileMedical, label: 'Dossier médical' },
    { path: '/rendez-vous', icon: FaCalendarAlt, label: 'Rendez-vous' },
    { path: '/messagerie', icon: FaEnvelope, label: 'Messagerie' },
    { path: '/profil', icon: FaUser, label: 'Profil' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay pour mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className="fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Menu</h2>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaTimes />
            </button>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={isActive(item.path) ? 'text-primary-600' : 'text-gray-400'} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 px-4 py-3 bg-primary-50 rounded-lg">
              <FaChartLine className="text-primary-600" />
              <div>
                <p className="text-xs text-gray-500">Connecté en tant que</p>
                <p className="text-sm font-medium text-primary-700">
                  {userRole === 'patient' ? 'Patient' : 'Professionnel'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;