import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendarCheck, FaEnvelope, FaUserCircle,
  FaSignOutAlt, FaBell, FaSearch, FaArrowRight, FaClock,
  FaShieldAlt, FaPlus, FaEllipsisH, FaCheck, FaTimes,
  FaLock, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://192.168.1.16:5000/api';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMedecin = user?.role === 'medecin';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [rdvList, setRdvList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingRdv, setLoadingRdv] = useState(true);

  // Modal RDV
  const [showRdvModal, setShowRdvModal] = useState(false);
  const [professionnels, setProfessionnels] = useState([]);
  const [rdvForm, setRdvForm] = useState({
    professionnel_id: '',
    date_rendezvous: '',
    motif: '',
    type_consultation: 'presentiel'
  });
  const [rdvSuccess, setRdvSuccess] = useState('');
  const [rdvError, setRdvError] = useState('');

  // Modal Securite
  const [showSecuModal, setShowSecuModal] = useState(false);
  const [secuForm, setSecuForm] = useState({ ancien_password: '', nouveau_password: '', confirm: '' });
  const [secuMsg, setSecuMsg] = useState('');
  const [secuError, setSecuError] = useState('');

  useEffect(() => {
    fetchRdv();
    fetchNotifications();
    if (!isMedecin) fetchProfessionnels();
  }, []);

  const fetchRdv = async () => {
    try {
      const res = await axios.get(`${API}/rendezvous/today`, { headers });
      setRdvList(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRdv(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API}/notifications`, { headers });
      setNotifications(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchProfessionnels = async () => {
    try {
      const res = await axios.get(`${API}/professionnels`, { headers });
      setProfessionnels(res.data);
    } catch (e) { console.error(e); }
  };

  const handleMarkNotifRead = async (id) => {
    await axios.put(`${API}/notifications/${id}/lu`, {}, { headers });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: 1 } : n));
  };

  const handleMarkAllRead = async () => {
    await axios.put(`${API}/notifications/lire-tout`, {}, { headers });
    setNotifications(prev => prev.map(n => ({ ...n, lu: 1 })));
  };

  const handleRdvSubmit = async (e) => {
    e.preventDefault();
    setRdvError('');
    setRdvSuccess('');
    try {
      await axios.post(`${API}/rendezvous`, rdvForm, { headers });
      setRdvSuccess('Rendez-vous créé avec succès !');
      setRdvForm({ professionnel_id: '', date_rendezvous: '', motif: '', type_consultation: 'presentiel' });
      fetchRdv();
      setTimeout(() => { setShowRdvModal(false); setRdvSuccess(''); }, 2000);
    } catch (e) {
      setRdvError(e.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleStatutRdv = async (id, statut) => {
    await axios.put(`${API}/rendezvous/${id}/statut`, { statut }, { headers });
    fetchRdv();
  };

  const handleSecuSubmit = async (e) => {
    e.preventDefault();
    setSecuError('');
    setSecuMsg('');
    if (secuForm.nouveau_password !== secuForm.confirm) {
      setSecuError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await axios.put(`${API}/securite/password`, {
        ancien_password: secuForm.ancien_password,
        nouveau_password: secuForm.nouveau_password
      }, { headers });
      setSecuMsg('Mot de passe mis à jour avec succès !');
      setSecuForm({ ancien_password: '', nouveau_password: '', confirm: '' });
      setTimeout(() => { setShowSecuModal(false); setSecuMsg(''); }, 2000);
    } catch (e) {
      setSecuError(e.response?.data?.message || 'Erreur');
    }
  };

  const unreadCount = notifications.filter(n => !n.lu).length;

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statutColors = {
    confirme: 'bg-green-100 text-green-700',
    en_attente: 'bg-yellow-100 text-yellow-700',
    annule: 'bg-red-100 text-red-600',
    termine: 'bg-slate-100 text-slate-500'
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-slate-900">

      {/* NAVBAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-14 h-14">
              <img src="/logo.png" alt="E-CARNET Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl leading-none tracking-tighter text-[#28a745]">
                E-CARNET<span className="text-slate-700">SANTÉ</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sénégal É-Santé</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-2xl gap-3 w-96">
            <FaSearch className="text-slate-400" />
            <input type="text" placeholder="Rechercher un dossier..." className="bg-transparent outline-none text-sm w-full font-medium" />
          </div>

          <div className="flex items-center gap-5">
            {/* Cloche notifications */}
            <div className="relative">
              <button
                onClick={() => document.getElementById('notif-panel').classList.toggle('hidden')}
                className="p-2.5 bg-slate-50 text-slate-500 hover:text-[#28a745] hover:bg-green-50 rounded-xl transition-all relative"
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Panel notifications */}
              <div id="notif-panel" className="hidden absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
                  <span className="font-black text-slate-800 text-sm">Notifications</span>
                  <button onClick={handleMarkAllRead} className="text-xs text-[#28a745] font-bold hover:underline">Tout lire</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-6">Aucune notification</p>
                  ) : notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkNotifRead(n.id)}
                      className={`px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 ${!n.lu ? 'bg-green-50/40' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className={`text-xs font-bold ${!n.lu ? 'text-slate-800' : 'text-slate-500'}`}>{n.titre}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                        </div>
                        {!n.lu && <span className="w-2 h-2 bg-green-500 rounded-full mt-1 shrink-0"></span>}
                      </div>
                      <p className="text-[10px] text-slate-300 mt-1">{formatDate(n.date_creation)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-none">{user?.prenom} {user?.nom}</p>
                <p className="text-[10px] font-bold text-[#28a745] uppercase tracking-widest mt-1.5 flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 bg-[#28a745] rounded-full animate-pulse"></span> {user?.role}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-[18px] border-2 border-white shadow-sm flex items-center justify-center text-[#28a745] font-black text-lg">
                {user?.prenom?.[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 lg:p-10 flex-1">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 italic">
              Bienvenue, {isMedecin ? 'Docteur' : ''} {user?.prenom}
            </h2>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <FaClock className="text-green-500" />
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • Dakar
            </p>
          </div>

          <button
            onClick={() => isMedecin ? navigate('/rendez-vous') : setShowRdvModal(true)}
            className="flex items-center justify-center gap-2 bg-[#28a745] hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-green-100 transition-all active:scale-95"
          >
            <FaPlus /> {isMedecin ? 'Gérer les consultations' : 'Prendre un rendez-vous'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* AGENDA */}
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-xl font-black text-slate-800 tracking-tight italic underline decoration-green-400 decoration-4 underline-offset-8">
                  {isMedecin ? "Agenda du jour" : "Prochains rendez-vous"}
                </h3>
                <button onClick={() => navigate('/rendez-vous')} className="text-[#28a745] font-bold text-sm hover:bg-green-50 px-4 py-2 rounded-xl transition-colors">
                  Voir tout
                </button>
              </div>

              <div className="p-6 space-y-4">
                {loadingRdv ? (
                  <div className="text-center py-8 text-slate-400">Chargement...</div>
                ) : rdvList.length === 0 ? (
                  <div className="text-center py-10">
                    <FaCalendarCheck className="text-4xl text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">
                      {isMedecin ? "Aucun rendez-vous aujourd'hui" : "Aucun rendez-vous à venir"}
                    </p>
                    {!isMedecin && (
                      <button onClick={() => setShowRdvModal(true)} className="mt-4 text-[#28a745] font-bold text-sm hover:underline">
                        Prendre un rendez-vous →
                      </button>
                    )}
                  </div>
                ) : rdvList.map((rdv, i) => (
                  <motion.div
                    key={rdv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 hover:shadow-lg hover:shadow-green-50 hover:border-green-100 transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${rdv.statut === 'en_attente' ? 'bg-yellow-50 text-yellow-500' : 'bg-green-50 text-[#28a745]'}`}>
                        {isMedecin ? <FaUserCircle /> : <FaCalendarCheck />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg group-hover:text-[#28a745] transition-colors">
                          {isMedecin
                            ? `${rdv.patient_prenom} ${rdv.patient_nom}`
                            : `Dr. ${rdv.medecin_prenom} ${rdv.medecin_nom}`}
                        </h4>
                        <p className="text-sm font-semibold text-slate-400">{rdv.motif}</p>
                        <p className="text-xs text-slate-300 mt-1">{rdv.type_consultation} • {rdv.duree} min</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-sm font-black text-slate-700">{formatDate(rdv.date_rendezvous)}</p>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${statutColors[rdv.statut] || 'bg-slate-100 text-slate-500'}`}>
                        {rdv.statut}
                      </span>
                      {isMedecin && rdv.statut === 'en_attente' && (
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleStatutRdv(rdv.id, 'confirme')}
                            className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                            title="Confirmer"
                          >
                            <FaCheck size={11} />
                          </button>
                          <button
                            onClick={() => handleStatutRdv(rdv.id, 'annule')}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                            title="Annuler"
                          >
                            <FaTimes size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* COLONNE DROITE */}
          <div className="lg:col-span-4 space-y-8">

            {/* NOTIFICATIONS */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3 italic">
                  <div className="p-2 bg-green-50 rounded-lg text-[#28a745] text-sm"><FaEnvelope /></div>
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{unreadCount}</span>
                  )}
                </h3>
                <FaEllipsisH className="text-slate-300 cursor-pointer" onClick={handleMarkAllRead} />
              </div>

              <div className="space-y-3 text-sm max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-4">Aucune notification</p>
                ) : notifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkNotifRead(n.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${!n.lu ? 'bg-green-50 border border-green-100' : 'bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-xs font-bold ${!n.lu ? 'text-slate-800' : 'text-slate-500'}`}>{n.titre}</p>
                      {!n.lu && <span className="w-2 h-2 bg-green-500 rounded-full mt-0.5 shrink-0"></span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECURITE */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative shadow-2xl overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <FaShieldAlt className="text-green-400 text-sm" />
                  <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Protection Active</span>
                </div>
                <h4 className="text-xl font-bold mb-3 tracking-tight text-white">E-CARNET PRIVACY</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                  Vos données médicales sont cryptées et hébergées conformément aux normes de la CDP Sénégal.
                </p>
                <button
                  onClick={() => setShowSecuModal(true)}
                  className="w-full py-3.5 bg-white/5 hover:bg-[#28a745] border border-white/10 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <FaLock /> Changer mon mot de passe <FaArrowRight className="text-[10px]" />
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

      {/* ── MODAL RENDEZ-VOUS ── */}
      <AnimatePresence>
        {showRdvModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowRdvModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800">Prendre un rendez-vous</h3>
                <button onClick={() => setShowRdvModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              {rdvSuccess && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-xl mb-4 text-sm font-bold">
                  <FaCheckCircle /> {rdvSuccess}
                </div>
              )}
              {rdvError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
                  <FaExclamationTriangle /> {rdvError}
                </div>
              )}

              <form onSubmit={handleRdvSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Médecin</label>
                  <select
                    required
                    value={rdvForm.professionnel_id}
                    onChange={e => setRdvForm({ ...rdvForm, professionnel_id: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                  >
                    <option value="">Choisir un médecin</option>
                    {professionnels.map(p => (
                      <option key={p.id} value={p.id}>Dr. {p.prenom} {p.nom} — {p.specialite}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date et heure</label>
                  <input
                    type="datetime-local"
                    required
                    value={rdvForm.date_rendezvous}
                    onChange={e => setRdvForm({ ...rdvForm, date_rendezvous: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Motif</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Consultation générale"
                    value={rdvForm.motif}
                    onChange={e => setRdvForm({ ...rdvForm, motif: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={rdvForm.type_consultation}
                    onChange={e => setRdvForm({ ...rdvForm, type_consultation: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                  >
                    <option value="presentiel">Présentiel</option>
                    <option value="teleconsultation">Téléconsultation</option>
                    <option value="domicile">À domicile</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#28a745] hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all mt-2"
                >
                  Confirmer le rendez-vous
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL SECURITE ── */}
      <AnimatePresence>
        {showSecuModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowSecuModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <FaShieldAlt className="text-[#28a745]" /> Changer le mot de passe
                </h3>
                <button onClick={() => setShowSecuModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              {secuMsg && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-xl mb-4 text-sm font-bold">
                  <FaCheckCircle /> {secuMsg}
                </div>
              )}
              {secuError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
                  <FaExclamationTriangle /> {secuError}
                </div>
              )}

              <form onSubmit={handleSecuSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Ancien mot de passe</label>
                  <input
                    type="password"
                    required
                    value={secuForm.ancien_password}
                    onChange={e => setSecuForm({ ...secuForm, ancien_password: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    value={secuForm.nouveau_password}
                    onChange={e => setSecuForm({ ...secuForm, nouveau_password: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Confirmer</label>
                  <input
                    type="password"
                    required
                    value={secuForm.confirm}
                    onChange={e => setSecuForm({ ...secuForm, confirm: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-700 text-white py-3.5 rounded-xl font-bold transition-all mt-2"
                >
                  Mettre à jour
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;