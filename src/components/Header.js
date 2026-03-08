import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaUserMd, FaSignOutAlt, FaBars } from 'react-icons/fa';

function Header({ userRole, onLogout, toggleSidebar }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaBars className="text-gray-600" />
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <FaHeartbeat className="text-primary-600 text-2xl" />
              <span className="font-bold text-xl text-gray-800">Carnet Santé</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 rounded-full">
              {userRole === 'patient' ? (
                <>
                  <span className="text-primary-600">👤</span>
                  <span className="text-sm font-medium text-primary-700">Patient</span>
                </>
              ) : (
                <>
                  <FaUserMd className="text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">Médecin</span>
                </>
              )}
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;