import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUserMd, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';

function RendezVous({ userRole }) {
  const [rendezvous, setRendezvous] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [filter, setFilter] = useState('tous');
  const [loading, setLoading] = useState(true);
  const [newRdv, setNewRdv] = useState({
    date: '',
    heure: '',
    medecin: '',
    motif: '',
    notes: ''
  });

  useEffect(() => {
    // Simuler le chargement des rendez-vous
    setTimeout(() => {
      setRendezvous([
        { 
          id: 1,
          date: '2024-03-15', 
          heure: '14:30',
          medecin: 'Dr. Martin',
          specialite: 'Médecine générale',
          motif: 'Consultation de routine',
          notes: 'Apporter les résultats d\'analyse',
          statut: 'confirmé'
        },
        { 
          id: 2,
          date: '2024-03-22', 
          heure: '09:00',
          medecin: 'Dr. Bernard',
          specialite: 'Cardiologie',
          motif: 'Analyse sanguine',
          notes: 'Être à jeun',
          statut: 'en_attente'
        },
        { 
          id: 3,
          date: '2024-03-28', 
          heure: '11:15',
          medecin: 'Dr. Dubois',
          specialite: 'Dermatologie',
          motif: 'Suivi',
          statut: 'confirmé'
        },
        { 
          id: 4,
          date: '2024-03-05', 
          heure: '10:30',
          medecin: 'Dr. Martin',
          specialite: 'Médecine générale',
          motif: 'Vaccin',
          statut: 'termine'
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const medecins = [
    { id: 1, nom: 'Dr. Martin', specialite: 'Médecine générale' },
    { id: 2, nom: 'Dr. Bernard', specialite: 'Cardiologie' },
    { id: 3, nom: 'Dr. Dubois', specialite: 'Dermatologie' },
    { id: 4, nom: 'Dr. Petit', specialite: 'Pédiatrie' },
  ];

  const handleInputChange = (e) => {
    setNewRdv({
      ...newRdv,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const medecinSelect = medecins.find(m => m.id === parseInt(newRdv.medecin));
    const nouveauRdv = {
      id: rendezvous.length + 1,
      ...newRdv,
      medecin: medecinSelect?.nom,
      specialite: medecinSelect?.specialite,
      statut: 'en_attente'
    };
    setRendezvous([...rendezvous, nouveauRdv]);
    setShowForm(false);
    setNewRdv({ date: '', heure: '', medecin: '', motif: '', notes: '' });
  };

  const getStatusBadge = (statut) => {
    const styles = {
      'confirmé': 'bg-green-100 text-green-700',
      'en_attente': 'bg-yellow-100 text-yellow-700',
      'annulé': 'bg-red-100 text-red-700',
      'terminé': 'bg-gray-100 text-gray-700'
    };
    const labels = {
      'confirmé': 'Confirmé',
      'en_attente': 'En attente',
      'annulé': 'Annulé',
      'terminé': 'Terminé'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[statut] || 'bg-gray-100 text-gray-700'}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  const filteredRdv = rendezvous.filter(rdv => {
    if (filter === 'tous') return true;
    if (filter === 'avenir') return new Date(rdv.date) >= new Date();
    if (filter === 'passes') return new Date(rdv.date) < new Date();
    return rdv.statut === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Mes Rendez-vous</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FaPlus />
          <span>Nouveau rendez-vous</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('tous')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'tous' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('avenir')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'avenir' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setFilter('passes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'passes' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Passés
          </button>
          <button
            onClick={() => setFilter('confirmé')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'confirmé' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Confirmés
          </button>
          <button
            onClick={() => setFilter('en_attente')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'en_attente' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En attente
          </button>
        </div>
      </div>

      {/* Formulaire nouveau rendez-vous */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Prendre un rendez-vous</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newRdv.date}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <input
                  type="time"
                  name="heure"
                  value={newRdv.heure}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Médecin</label>
              <select
                name="medecin"
                value={newRdv.medecin}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Sélectionner un médecin</option>
                {medecins.map(med => (
                  <option key={med.id} value={med.id}>
                    {med.nom} - {med.specialite}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
              <input
                type="text"
                name="motif"
                value={newRdv.motif}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ex: Consultation, analyse, suivi..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
              <textarea
                name="notes"
                value={newRdv.notes}
                onChange={handleInputChange}
                className="input-field"
                rows="3"
                placeholder="Informations complémentaires..."
              ></textarea>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Confirmer le rendez-vous
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des rendez-vous */}
      <div className="space-y-4">
        {filteredRdv.map((rdv) => (
          <div key={rdv.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <FaCalendarAlt className="text-primary-600 text-xl" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-800">{rdv.medecin}</h3>
                    <span className="text-sm text-gray-600">{rdv.specialite}</span>
                    {getStatusBadge(rdv.statut)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center space-x-1">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{new Date(rdv.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FaClock className="text-gray-400" />
                      <span>{rdv.heure}</span>
                    </span>
                  </div>
                  <p className="text-gray-700"><span className="font-medium">Motif:</span> {rdv.motif}</p>
                  {rdv.notes && (
                    <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Notes:</span> {rdv.notes}</p>
                  )}
                </div>
              </div>

              {userRole === 'medecin' && rdv.statut === 'en_attente' && (
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                    <FaCheck />
                    <span>Confirmer</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                    <FaTimes />
                    <span>Annuler</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RendezVous;