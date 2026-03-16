import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaUserInjured, FaSearch, FaQrcode, FaPhone,
  FaCalendarAlt, FaTint, FaEye, FaPlus
} from 'react-icons/fa';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

function MesPatients() {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      patients.filter(p =>
        `${p.nom} ${p.prenom}`.toLowerCase().includes(q) ||
        (p.groupe_sanguin || '').toLowerCase().includes(q)
      )
    );
  }, [search, patients]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API}/medecin/patients`, { headers });
      setPatients(res.data);
      setFiltered(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur chargement patients');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR');
  };

  const getAge = (dob) => {
    if (!dob) return '—';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + ' ans';
  };

  return (
    <div style={s.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');`}</style>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={s.header}>
        <div>
          <h1 style={s.title}>Mes Patients</h1>
          <p style={s.subtitle}>{filtered.length} patient{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <div style={s.headerRight}>
          <div style={s.searchBox}>
            <FaSearch style={{ color: '#94a3b8', fontSize: 13 }} />
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={s.searchInput}
            />
          </div>
        </div>
      </motion.div>

      {/* CONTENT */}
      {loading ? (
        <div style={s.center}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={s.spinner}
          />
        </div>
      ) : error ? (
        <div style={s.errorBox}>{error}</div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <FaUserInjured style={{ fontSize: 48, color: '#cbd5e1', marginBottom: 12 }} />
          <p style={{ color: '#94a3b8', fontWeight: 600 }}>Aucun patient trouvé</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={s.card}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
            >
              {/* Avatar */}
              <div style={s.cardTop}>
                <div style={s.avatar}>
                  <span style={s.avatarText}>
                    {p.prenom?.[0]}{p.nom?.[0]}
                  </span>
                </div>
                <div style={s.cardInfo}>
                  <h3 style={s.patientName}>{p.prenom} {p.nom}</h3>
                  <p style={s.patientSub}>{getAge(p.date_naissance)} • {formatDate(p.date_naissance)}</p>
                </div>
              </div>

              {/* Tags */}
              <div style={s.tags}>
                {p.groupe_sanguin && (
                  <span style={s.tagRed}>
                    <FaTint size={9} /> {p.groupe_sanguin}
                  </span>
                )}
                {p.telephone && (
                  <span style={s.tagGray}>
                    <FaPhone size={9} /> {p.telephone}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={s.actions}>
                <button
                  onClick={() => navigate(`/profil-patient?patientId=${p.id}`)}
                  style={s.btnPrimary}
                >
                  <FaEye size={12} /> Voir dossier
                </button>
                <button
                  onClick={() => navigate(`/rendez-vous?patient=${p.id}`)}
                  style={s.btnSecondary}
                >
                  <FaCalendarAlt size={11} />
                </button>
                <button
                  onClick={() => navigate(`/profil-patient?patientId=${p.id}`)}
                  style={s.btnSecondary}
                >
                  <FaQrcode size={11} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
    marginBottom: 28, flexWrap: 'wrap', gap: 16,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28, fontWeight: 800,
    color: '#0f172a', margin: 0,
  },
  subtitle: {
    fontSize: 13, color: '#64748b',
    margin: '4px 0 0', fontWeight: 400,
  },
  headerRight: {
    display: 'flex', gap: 12, alignItems: 'center',
  },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 14, padding: '10px 16px',
    width: 280,
  },
  searchInput: {
    border: 'none', outline: 'none',
    fontSize: 13, background: 'transparent',
    color: '#334155', width: '100%',
    fontFamily: "'DM Sans', sans-serif",
  },
  center: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: 300,
  },
  spinner: {
    width: 36, height: 36,
    border: '3px solid #e2e8f0',
    borderTopColor: '#28a745',
    borderRadius: '50%',
  },
  errorBox: {
    background: '#fef2f2', color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: 14, padding: '16px 20px',
    fontSize: 14, fontWeight: 500,
  },
  empty: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: 300,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 18,
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '20px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.2s',
    cursor: 'default',
  },
  cardTop: {
    display: 'flex', alignItems: 'center',
    gap: 14, marginBottom: 14,
  },
  avatar: {
    width: 48, height: 48,
    borderRadius: 14,
    background: 'linear-gradient(135deg, #28a745, #16a34a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800, fontSize: 16, color: '#fff',
  },
  cardInfo: { flex: 1, minWidth: 0 },
  patientName: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700, fontSize: 15,
    color: '#0f172a', margin: 0,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  patientSub: {
    fontSize: 12, color: '#64748b',
    margin: '3px 0 0', fontWeight: 400,
  },
  tags: {
    display: 'flex', gap: 6,
    flexWrap: 'wrap', marginBottom: 14,
  },
  tagRed: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    background: '#fef2f2', color: '#dc2626',
    fontSize: 11, fontWeight: 700,
    padding: '3px 8px', borderRadius: 100,
    border: '1px solid #fecaca',
  },
  tagGray: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    background: '#f8fafc', color: '#64748b',
    fontSize: 11, fontWeight: 600,
    padding: '3px 8px', borderRadius: 100,
    border: '1px solid #e2e8f0',
  },
  actions: {
    display: 'flex', gap: 8,
    borderTop: '1px solid #f1f5f9',
    paddingTop: 14,
  },
  btnPrimary: {
    flex: 1,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    background: '#28a745', color: '#fff',
    border: 'none', borderRadius: 10,
    padding: '8px 12px', fontSize: 12,
    fontWeight: 700, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  btnSecondary: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc', color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: 10, padding: '8px 12px',
    fontSize: 12, cursor: 'pointer',
  },
};

export default MesPatients;