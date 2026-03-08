import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    groupeSanguin: 'A+' // Valeur par défaut
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // <--- Correction ici (Défini localement)
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true); // <--- Fonctionne maintenant

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/login', { state: { message: 'Inscription réussie ! Connectez-vous.' } });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 font-serif">Créer un compte</h2>
          <p className="mt-2 text-gray-500 italic">E-Carnet-Santé : Votre santé entre vos mains</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">{error}</div>}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Nom & Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input type="text" name="nom" required className="w-full p-3 border rounded-lg" value={formData.nom} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input type="text" name="prenom" required className="w-full p-3 border rounded-lg" value={formData.prenom} onChange={handleChange} />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required className="w-full p-3 border rounded-lg" value={formData.email} onChange={handleChange} />
          </div>

          {/* Telephone & Date Naissance */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input type="tel" name="telephone" className="w-full p-3 border rounded-lg" value={formData.telephone} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de Naissance</label>
            <input type="date" name="dateNaissance" className="w-full p-3 border rounded-lg" value={formData.dateNaissance} onChange={handleChange} />
          </div>

          {/* Passwords */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input type="password" name="password" required className="w-full p-3 border rounded-lg" value={formData.password} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmation</label>
            <input type="password" name="confirmPassword" required className="w-full p-3 border rounded-lg" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          {/* Role */}
          <div className="md:col-span-2 flex gap-4 p-3 bg-blue-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="role" value="patient" checked={formData.role === 'patient'} onChange={handleChange} />
              <span>Je suis un Patient</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="role" value="medecin" checked={formData.role === 'medecin'} onChange={handleChange} />
              <span>Je suis un Médecin</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Traitement en cours...' : "S'inscrire gratuitement"}
          </button>
        </form>

        <p className="text-center text-gray-500">
          Déjà un compte ? <Link to="/login" className="text-blue-600 font-bold underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;