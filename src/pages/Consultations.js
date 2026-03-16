import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStethoscope, FaSearch, FaPlus, FaCheck,
  FaTimes, FaClock, FaUserInjured, FaCalendarAlt,
  FaCheckCircle, FaExclamationTriangle, FaFilter
} from 'react-icons/fa';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const STATUTS = ['tous', 'en_attente', 'confirme', 'termine', 'annule'];

const statutStyle = {
  en_attente:  { bg: '#fefce8', color: '#ca8a04', border: '#fde68a', label: 'En attente' },
  confirme:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: 'Confirmé' },
  termine:     { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0', label: 'Terminé' },
  annule:      { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Annulé' },
};

function Consultations() {
  const [rdvList, setRdvList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchConsultations(); }, []);

  useEffect(() => {
    let list = rdvList;
    if (statut !== 'tous') list = list.filter(r => r.statut === statut);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        `${r.patient_nom} ${r.patient_prenom}`.toLowerCase().includes(q) ||
        (r.motif || '').toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, statut, rdvList]);

  const fetchConsultations = async () => {
    try {
      const res = await axios.get(`${API}/medecin/consultations`, { headers });
      setRdvList(res.data);
      setFiltered(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur chargement consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatut = async (id, newStatut) => {
    try {
      await axios.put(`${API}/rendezvous/${id}/statut`, { statut: newStatut }, { headers });
      setRdvList(prev => prev.map(r => r.id === id ? { ...r, statut: newStatut } : r));
      setSuccessMsg(`Statut mis à jour : ${statutStyle[newStatut]?.label}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      setError('Erreur mise à jour statut');
    }
  };

  const openNotes = (rdv) => {
    setSelectedRdv(rdv);
    setNotes(rdv.notes || '');
    setShowModal(true);
  };

  const saveNotes = async () => {
    try {
      await axios.put(`${API}/rendezvous/${selectedRdv.id}/notes`, { notes }, { headers });
      setRdvList(prev => prev.map(r => r.id === selectedRdv.id ? { ...r, notes } : r));
      setShowModal(false);
      setSuccessMsg('Notes sauvegardées');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      setError('Erreur sauvegarde notes');
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', {
      weekday: 'short', day: '2-digit',
      month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const counts = STATUTS.slice(1).reduce((acc, s) => {
    acc[s] = rdvList.filter(r => r.statut === s).length;
    return acc;
  }, {});

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');`}</style>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={s.header}>
        <div>
          <h1 style={s.title}>Consultations</h1>
          <p style={s.subtitle}>{filtered.length} consultation{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <div style={s.searchBox}>
          <FaSearch style={{ color: '#94a3b8', fontSize: 13 }} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>
      </motion.div>

      {/* STATS */}
      <div style={s.statsRow}>
        {Object.entries(counts).map(([key, count]) => (
          <div key={key} style={{ ...s.statCard, borderColor: statutStyle[key]?.border, background: statutStyle[key]?.bg }}>
            <span style={{ ...s.statCount, color: statutStyle[key]?.color }}>{count}</span>
            <span style={s.statLabel}>{statutStyle[key]?.label}</span>
          </div>
        ))}
      </div>

      {/* SUCCESS MSG */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={s.successBar}
          >
            <FaCheckCircle /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTRES */}
      <div style={s.filters}>
        <FaFilter style={{ color: '#94a3b8', fontSize: 12 }} />
        {STATUTS.map(s2 => (
          <button
            key={s2}
            onClick={() => setStatut(s2)}
            style={{
              ...s.filterBtn,
              ...(statut === s2 ? s.filterBtnActive : {})
            }}
          >
            {s2 === 'tous' ? 'Tous' : statutStyle[s2]?.label}
            {s2 !== 'tous' && counts[s2] > 0 && (
              <span style={{ ...s.filterCount, background: statut === s2 ? '#fff' : '#e2e8f0', color: statut === s2 ? '#28a745' : '#64748b' }}>
                {counts[s2]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* LISTE */}
      {loading ? (
        <div style={s.center}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={s.spinner} />
        </div>
      ) : error ? (
        <div style={s.errorBox}>{error}</div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <FaStethoscope style={{ fontSize: 48, color: '#cbd5e1', marginBottom: 12 }} />
          <p style={{ color: '#94a3b8', fontWeight: 600 }}>Aucune consultation trouvée</p>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map((rdv, i) => {
            const st = statutStyle[rdv.statut] || statutStyle.en_attente;
            return (
              <motion.div
                key={rdv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={s.row}
              >
                {/* Indicateur statut */}
                <div style={{ ...s.statIndicator, background: st.color }} />

                {/* Infos patient */}
                <div style={s.patientCol}>
                  <div style={s.avatarSmall}>
                    {rdv.patient_prenom?.[0]}{rdv.patient_nom?.[0]}
                  </div>
                  <div>
                    <p style={s.patientName}>{rdv.patient_prenom} {rdv.patient_nom}</p>
                    <p style={s.patientSub}>{rdv.motif || 'Consultation générale'}</p>
                  </div>
                </div>

                {/* Date */}
                <div style={s.dateCol}>
                  <FaCalendarAlt style={{ color: '#94a3b8', fontSize: 11 }} />
                  <span style={s.dateText}>{formatDate(rdv.date_rendezvous)}</span>
                </div>

                {/* Type */}
                <div style={s.typeCol}>
                  <span style={s.typeTag}>{rdv.type_consultation}</span>
                </div>

                {/* Durée */}
                <div style={s.durCol}>
                  <FaClock style={{ color: '#94a3b8', fontSize: 11 }} />
                  <span style={s.dateText}>{rdv.duree || 30} min</span>
                </div>

                {/* Statut */}
                <span style={{ ...s.statutTag, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                  {st.label}
                </span>

                {/* Actions */}
                <div style={s.actionsCol}>
                  {rdv.statut === 'en_attente' && (
                    <>
                      <button onClick={() => handleStatut(rdv.id, 'confirme')} style={s.btnGreen} title="Confirmer">
                        <FaCheck size={11} />
                      </button>
                      <button onClick={() => handleStatut(rdv.id, 'annule')} style={s.btnRed} title="Annuler">
                        <FaTimes size={11} />
                      </button>
                    </>
                  )}
                  {rdv.statut === 'confirme' && (
                    <button onClick={() => handleStatut(rdv.id, 'termine')} style={s.btnGray} title="Marquer terminé">
                      <FaCheckCircle size={11} />
                    </button>
                  )}
                  <button onClick={() => openNotes(rdv)} style={s.btnNotes} title="Notes">
                    <FaStethoscope size={11} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MODAL NOTES */}
      <AnimatePresence>
        {showModal && selectedRdv && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={s.overlay}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              style={s.modal}
            >
              <div style={s.modalHeader}>
                <div>
                  <h3 style={s.modalTitle}>Notes de consultation</h3>
                  <p style={s.modalSub}>{selectedRdv.patient_prenom} {selectedRdv.patient_nom} • {formatDate(selectedRdv.date_rendezvous)}</p>
                </div>
                <button onClick={() => setShowModal(false)} style={s.closeBtn}><FaTimes /></button>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Saisir vos notes cliniques, observations, prescriptions..."
                style={s.textarea}
              />
              <div style={s.modalFooter}>
                <button onClick={() => setShowModal(false)} style={s.btnCancel}>Annuler</button>
                <button onClick={saveNotes} style={s.btnSave}>
                  <FaCheck size={12} /> Sauvegarder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const s = {
  page: {
    maxWidth: 1100, margin: '0 auto',
    padding: '24px 20px 48px',
    fontFamily: "'DM Sans', sans-serif",
    minHeight: '100vh',
  },
  header: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20, flexWrap: 'wrap', gap: 16,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28, fontWeight: 800,
    color: '#0f172a', margin: 0,
  },
  subtitle: { fontSize: 13, color: '#64748b', margin: '4px 0 0' },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: 14, padding: '10px 16px', width: 260,
  },
  searchInput: {
    border: 'none', outline: 'none', fontSize: 13,
    background: 'transparent', color: '#334155', width: '100%',
    fontFamily: "'DM Sans', sans-serif",
  },
  statsRow: {
    display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap',
  },
  statCard: {
    flex: 1, minWidth: 100,
    padding: '14px 18px',
    borderRadius: 14, border: '1px solid',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  statCount: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800, fontSize: 22, lineHeight: 1,
  },
  statLabel: {
    fontSize: 11, color: '#64748b',
    marginTop: 4, fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  successBar: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#f0fdf4', color: '#16a34a',
    border: '1px solid #bbf7d0',
    borderRadius: 12, padding: '10px 16px',
    fontSize: 13, fontWeight: 600, marginBottom: 16,
  },
  filters: {
    display: 'flex', alignItems: 'center',
    gap: 8, marginBottom: 20, flexWrap: 'wrap',
  },
  filterBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#fff', border: '1px solid #e2e8f0',
    color: '#64748b', borderRadius: 10,
    padding: '7px 14px', fontSize: 12,
    fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  filterBtnActive: {
    background: '#28a745', color: '#fff',
    border: '1px solid #28a745',
  },
  filterCount: {
    fontSize: 10, fontWeight: 800,
    padding: '1px 6px', borderRadius: 100,
  },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 },
  spinner: { width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#28a745', borderRadius: '50%' },
  errorBox: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 14, padding: '16px 20px', fontSize: 14 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  row: {
    display: 'flex', alignItems: 'center',
    gap: 16, background: '#fff',
    borderRadius: 16, padding: '14px 18px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
    flexWrap: 'wrap',
  },
  statIndicator: { width: 4, height: 40, borderRadius: 4, flexShrink: 0 },
  patientCol: { display: 'flex', alignItems: 'center', gap: 10, flex: 2, minWidth: 160 },
  avatarSmall: {
    width: 38, height: 38, borderRadius: 10,
    background: 'linear-gradient(135deg, #28a745, #16a34a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Syne', sans-serif", fontWeight: 800,
    fontSize: 13, color: '#fff', flexShrink: 0,
  },
  patientName: { fontWeight: 700, fontSize: 14, color: '#0f172a', margin: 0 },
  patientSub: { fontSize: 12, color: '#64748b', margin: '2px 0 0' },
  dateCol: { display: 'flex', alignItems: 'center', gap: 6, flex: 2, minWidth: 160 },
  dateText: { fontSize: 12, color: '#64748b' },
  typeCol: { flex: 1, minWidth: 100 },
  typeTag: {
    fontSize: 11, fontWeight: 600,
    background: '#f0f9ff', color: '#0369a1',
    padding: '3px 8px', borderRadius: 100,
    border: '1px solid #bae6fd',
    textTransform: 'capitalize',
  },
  durCol: { display: 'flex', alignItems: 'center', gap: 5 },
  statutTag: {
    fontSize: 11, fontWeight: 700,
    padding: '4px 10px', borderRadius: 100,
    whiteSpace: 'nowrap',
  },
  actionsCol: { display: 'flex', gap: 6, marginLeft: 'auto' },
  btnGreen: {
    width: 30, height: 30, borderRadius: 8,
    background: '#f0fdf4', color: '#16a34a',
    border: '1px solid #bbf7d0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  btnRed: {
    width: 30, height: 30, borderRadius: 8,
    background: '#fef2f2', color: '#dc2626',
    border: '1px solid #fecaca',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  btnGray: {
    width: 30, height: 30, borderRadius: 8,
    background: '#f8fafc', color: '#64748b',
    border: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  btnNotes: {
    width: 30, height: 30, borderRadius: 8,
    background: 'rgba(40,167,69,0.08)', color: '#28a745',
    border: '1px solid rgba(40,167,69,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.45)', zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  modal: {
    background: '#fff', borderRadius: 24,
    padding: 28, width: '100%', maxWidth: 500,
    boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800, fontSize: 18,
    color: '#0f172a', margin: 0,
  },
  modalSub: { fontSize: 12, color: '#64748b', margin: '4px 0 0' },
  closeBtn: {
    background: 'none', border: 'none',
    color: '#94a3b8', cursor: 'pointer', fontSize: 16,
  },
  textarea: {
    width: '100%', minHeight: 160,
    border: '1px solid #e2e8f0', borderRadius: 14,
    padding: '14px', fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    resize: 'vertical', outline: 'none',
    color: '#334155', boxSizing: 'border-box',
  },
  modalFooter: {
    display: 'flex', gap: 10,
    justifyContent: 'flex-end', marginTop: 16,
  },
  btnCancel: {
    background: '#f8fafc', border: '1px solid #e2e8f0',
    color: '#64748b', borderRadius: 10,
    padding: '9px 18px', fontSize: 13,
    fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  btnSave: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#28a745', border: 'none',
    color: '#fff', borderRadius: 10,
    padding: '9px 18px', fontSize: 13,
    fontWeight: 700, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
};

export default Consultations;