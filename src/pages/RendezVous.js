import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUserMd, FaCheck, FaTimes, FaPlus, FaMapMarkerAlt, FaNotesMedical } from 'react-icons/fa';

function RendezVous({ userRole }) {
  const [rendezvous, setRendezvous] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('tous');
  const [loading, setLoading] = useState(true);
  const [newRdv, setNewRdv] = useState({
    date: '',
    heure: '',
    medecin: '',
    motif: '',
    notes: ''
  });

  // Liste des médecins localisée au Sénégal
  const medecins = [
    { id: 1, nom: 'Dr. Amadou Sy', specialite: 'Médecine Générale', structure: 'Hôpital Principal' },
    { id: 2, nom: 'Dr. Fatoumata Sow', specialite: 'Cardiologie', structure: 'Clinique de la Madeleine' },
    { id: 3, nom: 'Dr. Ibrahima Kane', specialite: 'Dermatologie', structure: 'Hôpital Aristide Le Dantec' },
    { id: 4, nom: 'Dr. Khadija Fall', specialite: 'Pédiatrie', structure: 'Centre de Santé Gaspard Kamara' },
  ];

  useEffect(() => {
    setTimeout(() => {
      setRendezvous([
        { 
          id: 1,
          date: '2024-03-15', 
          heure: '14:30',
          medecin: 'Dr. Amadou Sy',
          specialite: 'Médecine Générale',
          motif: 'Consultation annuelle',
          notes: 'Vérification tension artérielle',
          statut: 'confirmé'
        },
        { 
          id: 2,
          date: '2024-03-22', 
          heure: '09:00',
          medecin: 'Dr. Fatoumata Sow',
          specialite: 'Cardiologie',
          motif: 'Contrôle post-opératoire',
          notes: 'Venir avec le carnet de santé',
          statut: 'en_attente'
        },
        { 
          id: 4,
          date: '2024-03-01', 
          heure: '10:30',
          medecin: 'Dr. Amadou Sy',
          specialite: 'Médecine Générale',
          motif: 'Vaccination grippe',
          statut: 'terminé'
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleInputChange = (e) => {
    setNewRdv({ ...newRdv, [e.target.name]: e.target.value });
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
    setRendezvous([nouveauRdv, ...rendezvous]);
    setShowForm(false);
    setNewRdv({ date: '', heure: '', medecin: '', motif: '', notes: '' });
  };

  const getStatusBadge = (statut) => {
    const config = {
      'confirmé': { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Confirmé' },
      'en_attente': { bg: 'bg-amber-50 text-amber-600 border-amber-100', label: 'En attente' },
      'annulé': { bg: 'bg-rose-50 text-rose-600 border-rose-100', label: 'Annulé' },
      'terminé': { bg: 'bg-slate-50 text-slate-500 border-slate-100', label: 'Terminé' }
    };
    const current = config[statut] || config['terminé'];
    return (
      <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest ${current.bg}`}>
        {current.label}
      </span>
    );
  };

  const filteredRdv = rendezvous.filter(rdv => {
    if (filter === 'tous') return true;
    if (filter === 'avenir') return new Date(rdv.date) >= new Date();
    if (filter === 'passes') return new Date(rdv.date) < new Date();
    return rdv.statut === filter;
  });

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Chargement de l'agenda...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Agenda Médical</h1>
          <p className="text-slate-500 font-medium mt-1">Gérez vos consultations et rendez-vous à venir.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all transform hover:scale-105 active:scale-95"
        >
          <FaPlus />
          <span>Prendre RDV</span>
        </button>
      </div>

      {/* FILTERS BAR */}
      <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
        {['tous', 'avenir', 'passes', 'confirmé', 'en_attente'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
              filter === f 
              ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200' 
              : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* FORM MODAL (Overlay style) */}
      {showForm && (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 p-8 md:p-12 relative animate-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><FaCalendarAlt size={18}/></div>
            Nouveau Rendez-vous
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Médecin & Spécialité</label>
                <select
                  name="medecin"
                  value={newRdv.medecin}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700 appearance-none"
                  required
                >
                  <option value="">Choisir un praticien...</option>
                  {medecins.map(med => (
                    <option key={med.id} value={med.id}>{med.nom} ({med.specialite})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Date</label>
                  <input type="date" name="date" value={newRdv.date} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 font-bold text-slate-700" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Heure</label>
                  <input type="time" name="heure" value={newRdv.heure} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 font-bold text-slate-700" required />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Motif de consultation</label>
                <input type="text" name="motif" value={newRdv.motif} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 font-bold text-slate-700" placeholder="Ex: Douleurs abdominales, Suivi..." required />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Notes ou symptômes</label>
                <textarea name="notes" value={newRdv.notes} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-blue-50 font-bold text-slate-700 h-[100px]" placeholder="Optionnel..." />
              </div>
            </div>
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg transition-all">Confirmer la demande</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* APPOINTMENTS LIST */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRdv.length > 0 ? filteredRdv.map((rdv) => (
          <div key={rdv.id} className="group bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Left: Date Block */}
              <div className="flex flex-col items-center justify-center w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                <span className="text-xs font-black uppercase tracking-widest">
                  {new Date(rdv.date).toLocaleDateString('fr-FR', { month: 'short' })}
                </span>
                <span className="text-3xl font-black leading-none my-1">
                  {new Date(rdv.date).getDate()}
                </span>
                <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">
                  {rdv.heure}
                </span>
              </div>

              {/* Center: Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-black text-slate-800">{rdv.medecin}</h3>
                  {getStatusBadge(rdv.statut)}
                </div>
                <div className="flex flex-wrap gap-y-2 gap-x-6">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <FaUserMd className="text-blue-600"/> {rdv.specialite}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <FaNotesMedical className="text-blue-600"/> {rdv.motif}
                  </div>
                </div>
                {rdv.notes && (
                  <p className="text-sm text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 inline-block">
                    <span className="font-black text-slate-500 mr-2 uppercase text-[10px]">Note:</span>
                    {rdv.notes}
                  </p>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex flex-row md:flex-col gap-2 shrink-0">
                {userRole === 'medecin' && rdv.statut === 'en_attente' ? (
                  <>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                      <FaCheck /> CONFIRMER
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-rose-600 border border-rose-100 rounded-xl font-black text-xs hover:bg-rose-50 transition-all">
                      <FaTimes /> REFUSER
                    </button>
                  </>
                ) : (
                  <button className="px-6 py-3 bg-slate-50 text-slate-500 rounded-xl font-black text-[10px] hover:bg-slate-100 transition-all border border-slate-100">
                    DÉTAILS DU RDV
                  </button>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">Aucun rendez-vous trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RendezVous;