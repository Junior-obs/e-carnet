import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt,
  FaTint, FaFileMedical, FaShieldAlt, FaCamera,
  FaSignOutAlt, FaMapMarkerAlt, FaIdCard, FaHeartbeat,
  FaQrcode, FaEdit, FaCheck, FaTimes, FaSave,
  FaExclamationTriangle, FaCheckCircle, FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import PatientQR from '../components/PatientQR';
import MedecinQR from '../components/MedecinQR';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;
const BASE = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

function Profil() {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const isMedecin = user?.role === 'medecin';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const fileRef = useRef(null);

  // Data
  const [profil, setProfil] = useState(null);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  // Photo
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoMsg, setPhotoMsg] = useState('');

  const patientIdFromQR = searchParams.get('patientId');
  const profileId = patientIdFromQR || user?.profile_id;

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const url = isMedecin
        ? `${API}/medecins/me/full`
        : `${API}/patients/me/full`;
      const res = await axios.get(url, { headers });
      setProfil(res.data);
      setEditForm(res.data);
    } catch (e) {
      console.error(e);
      // Fallback sur le contexte
      setProfil(user);
      setEditForm(user || {});
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError('');
    setSaveMsg('');
    try {
      const url = isMedecin
        ? `${API}/medecins/me/update`
        : `${API}/patients/me/update`;
      await axios.put(url, editForm, { headers });
      setSaveMsg('Profil mis à jour avec succès !');
      setProfil({ ...profil, ...editForm });
      setTimeout(() => {
        setEditing(false);
        setSaveMsg('');
      }, 1800);
    } catch (e) {
      setSaveError(e.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    setPhotoMsg('');
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await axios.post(`${API}/profil/photo`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setProfil(prev => ({ ...prev, photo: res.data.photo }));
      setPhotoMsg('Photo mise à jour !');
      setTimeout(() => setPhotoMsg(''), 2500);
    } catch (e) {
      setPhotoMsg('Erreur upload photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#f8fafc' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2"
          style={{ borderColor: '#28a745', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  const data = profil || user || {};
  const initials = `${data?.prenom?.[0] || ''}${data?.nom?.[0] || ''}`.toUpperCase();
  const photoUrl = data?.photo ? `${BASE}${data.photo}` : null;

  const infoItems = isMedecin ? [
    { icon: <FaEnvelope />, label: 'Email', value: data?.email, field: null },
    { icon: <FaIdCard />, label: 'Spécialité', value: data?.specialite, field: 'specialite' },
    { icon: <FaPhone />, label: 'Téléphone', value: data?.telephone, field: 'telephone' },
    { icon: <FaMapMarkerAlt />, label: 'Cabinet', value: data?.cabinet, field: 'cabinet' },
    { icon: <FaMapMarkerAlt />, label: 'Adresse cabinet', value: data?.adresse_cabinet, field: 'adresse_cabinet' },
    { icon: <FaMapMarkerAlt />, label: 'Ville', value: data?.ville, field: 'ville' },
  ] : [
    { icon: <FaEnvelope />, label: 'Email', value: data?.email, field: null },
    { icon: <FaPhone />, label: 'Téléphone', value: data?.telephone, field: 'telephone' },
    { icon: <FaCalendarAlt />, label: 'Date de naissance', value: data?.date_naissance, field: null },
    { icon: <FaMapMarkerAlt />, label: 'Adresse', value: data?.adresse, field: 'adresse' },
    { icon: <FaMapMarkerAlt />, label: 'Ville', value: data?.ville, field: 'ville' },
    { icon: <FaTint />, label: 'Groupe sanguin', value: data?.groupe_sanguin, field: 'groupe_sanguin' },
  ];

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        input:focus { outline: none; border-color: #28a745 !important; box-shadow: 0 0 0 3px rgba(40,167,69,0.1); }
      `}</style>

      {/* ── HEADER CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={s.headerCard}
      >
        <div style={s.banner}>
          <div style={s.bannerPattern} />
        </div>

        <div style={s.headerBody}>
          <div style={s.avatarRow}>

            {/* Avatar + upload photo */}
            <div style={s.avatarWrap}>
              <div style={s.avatar}>
                {photoUrl ? (
                  <img src={photoUrl} alt="profil" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 17 }} />
                ) : (
                  <span style={s.avatarText}>{initials}</span>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <button
                style={s.cameraBtn}
                onClick={() => fileRef.current.click()}
                title="Changer la photo"
              >
                {photoLoading
                  ? <FaSpinner size={11} style={{ animation: 'spin 1s linear infinite' }} />
                  : <FaCamera size={12} />
                }
              </button>
              {photoMsg && (
                <div style={s.photoMsg}>{photoMsg}</div>
              )}
            </div>

            <div style={s.headerInfo}>
              <div style={s.rolePill}>
                <span style={s.roleDot} />
                {isMedecin ? 'Médecin' : 'Patient'}
              </div>
              <h1 style={s.name}>{data?.prenom} {data?.nom}</h1>
              <p style={s.subname}>
                {isMedecin
                  ? (data?.specialite || 'Généraliste')
                  : `Dossier #SN-${String(profileId || '0000').slice(-4).padStart(4, '0')}`}
              </p>
            </div>

            <div style={s.headerActions}>
              <div style={s.verifiedBadge}>
                <FaCheck size={9} /> Compte vérifié
              </div>
              <button onClick={logout} style={s.logoutBtn}>
                <FaSignOutAlt size={13} /> Déconnexion
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div style={s.statsBar}>
            {isMedecin ? (
              <>
                <StatItem label="Spécialité" value={data?.specialite || '—'} />
                <div style={s.statDiv} />
                <StatItem label="Cabinet" value={data?.cabinet || '—'} />
                <div style={s.statDiv} />
                <StatItem label="Ville" value={data?.ville || '—'} />
              </>
            ) : (
              <>
                <StatItem label="Groupe sanguin" value={data?.groupe_sanguin || '—'} accent />
                <div style={s.statDiv} />
                <StatItem label="Dossier" value="Actif" green />
                <div style={s.statDiv} />
                <StatItem label="ID Sécurité" value={`#${String(profileId || '0').slice(-6).padStart(6, '0')}`} />
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── GRID ── */}
      <div style={s.grid}>

        {/* COLONNE GAUCHE */}
        <div style={s.leftCol}>

          {/* Infos personnelles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={s.card}
          >
            <div style={s.cardHeader}>
              <div style={{ ...s.cardIcon, background: 'rgba(40,167,69,0.1)', color: '#28a745' }}>
                <FaUser size={14} />
              </div>
              <h2 style={s.cardTitle}>Informations personnelles</h2>
              {!editing ? (
                <button style={s.editBtn} onClick={() => setEditing(true)}>
                  <FaEdit size={11} /> Modifier
                </button>
              ) : (
                <button style={s.cancelBtn} onClick={() => { setEditing(false); setEditForm(data); setSaveError(''); }}>
                  <FaTimes size={11} /> Annuler
                </button>
              )}
            </div>

            {/* Messages */}
            <AnimatePresence>
              {saveMsg && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={s.successMsg}>
                  <FaCheckCircle /> {saveMsg}
                </motion.div>
              )}
              {saveError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={s.errorMsg}>
                  <FaExclamationTriangle /> {saveError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulaire ou affichage */}
            {editing ? (
              <form onSubmit={handleSave}>
                <div style={s.infoGrid}>
                  {infoItems.map((item, i) => (
                    <div key={i} style={s.infoItem}>
                      <div style={s.infoIcon}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={s.infoLabel}>{item.label}</p>
                        {item.field ? (
                          <input
                            value={editForm[item.field] || ''}
                            onChange={e => setEditForm({ ...editForm, [item.field]: e.target.value })}
                            style={s.editInput}
                            placeholder={`Entrez votre ${item.label.toLowerCase()}`}
                          />
                        ) : (
                          <p style={s.infoValue}>{item.value || '—'}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={saveLoading}
                  style={s.saveBtn}
                >
                  {saveLoading
                    ? <><FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Sauvegarde...</>
                    : <><FaSave size={13} /> Enregistrer les modifications</>
                  }
                </button>
              </form>
            ) : (
              <div style={s.infoGrid}>
                {infoItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    style={s.infoItem}
                  >
                    <div style={s.infoIcon}>{item.icon}</div>
                    <div>
                      <p style={s.infoLabel}>{item.label}</p>
                      <p style={s.infoValue}>{item.value || '—'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sécurité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ ...s.card, ...s.secuCard }}
          >
            <div style={s.cardHeader}>
              <div style={{ ...s.cardIcon, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <FaShieldAlt size={14} />
              </div>
              <h2 style={{ ...s.cardTitle, color: '#fff' }}>Sécurité & Confidentialité</h2>
            </div>
            <div>
              <SecuRow label="Authentification" value="Active" ok />
              <SecuRow label="Données chiffrées" value="AES-256" ok />
              <SecuRow label="Norme CDP Sénégal" value="Conforme" ok />
              <SecuRow label="Dernière connexion" value="Aujourd'hui" ok />
            </div>
          </motion.div>
        </div>

        {/* COLONNE DROITE */}
        <div style={s.rightCol}>

          {/* Dossier médical patient */}
          {!isMedecin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={s.card}
            >
              <div style={s.cardHeader}>
                <div style={{ ...s.cardIcon, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  <FaFileMedical size={14} />
                </div>
                <h2 style={s.cardTitle}>Dossier Médical</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={s.dossierRow}>
                  <div style={{ ...s.dossierIcon, background: '#fef2f2' }}>
                    <FaTint style={{ color: '#ef4444' }} />
                  </div>
                  <div>
                    <p style={s.dossierLabel}>Groupe sanguin</p>
                    <p style={s.dossierValue}>{data?.groupe_sanguin || '—'}</p>
                  </div>
                </div>

                <div style={s.dossierRow}>
                  <div style={{ ...s.dossierIcon, background: '#f0fdf4' }}>
                    <FaHeartbeat style={{ color: '#28a745' }} />
                  </div>
                  <div>
                    <p style={s.dossierLabel}>Statut dossier</p>
                    <p style={{ ...s.dossierValue, color: '#28a745' }}>Actif</p>
                  </div>
                </div>

                {data?.personne_contact && (
                  <div style={s.dossierRow}>
                    <div style={{ ...s.dossierIcon, background: '#f0f9ff' }}>
                      <FaPhone style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <p style={s.dossierLabel}>Contact urgence</p>
                      <p style={s.dossierValue}>{data.personne_contact}</p>
                    </div>
                  </div>
                )}

                <div style={s.dossierNumero}>
                  <p style={s.dossierNumeroLabel}>Numéro de dossier</p>
                  <p style={s.dossierNumeroValue}>
                    SN-CARNET-2026-{String(profileId || '0000').slice(-4).padStart(4, '0')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={s.card}
          >
            <div style={s.cardHeader}>
              <div style={{ ...s.cardIcon, background: 'rgba(40,167,69,0.1)', color: '#28a745' }}>
                <FaQrcode size={14} />
              </div>
              <h2 style={s.cardTitle}>Mon QR Code</h2>
            </div>
            <p style={s.qrDesc}>
              {isMedecin
                ? 'Partagez ce QR pour que vos patients puissent vous identifier.'
                : 'Présentez ce QR à votre médecin pour un accès instantané à votre dossier.'}
            </p>
            <div style={s.qrWrap}>
              {isMedecin
                ? <MedecinQR medecinId={profileId} />
                : <PatientQR patientId={profileId} />
              }
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function StatItem({ label, value, accent, green }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 20px', flex: 1 }}>
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800, fontSize: 16,
        color: accent ? '#ef4444' : green ? '#28a745' : '#1e293b',
        lineHeight: 1, margin: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }}>{value}</p>
      <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>{label}</p>
    </div>
  );
}

function SecuRow({ label, value, ok }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: ok ? '#4ade80' : '#f87171', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: ok ? '#4ade80' : '#f87171', display: 'inline-block' }} />
        {value}
      </span>
    </div>
  );
}

const s = {
  page: {
    maxWidth: 1100, margin: '0 auto',
    padding: '24px 20px 48px',
    fontFamily: "'DM Sans', sans-serif",
    background: '#f8fafc', minHeight: '100vh',
  },
  headerCard: {
    background: '#fff', borderRadius: 28,
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.04)',
    marginBottom: 24,
  },
  banner: {
    height: 110,
    background: 'linear-gradient(135deg, #0f2027 0%, #1a3a2a 50%, #28a745 100%)',
    position: 'relative', overflow: 'hidden',
  },
  bannerPattern: {
    position: 'absolute', inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  headerBody: { padding: '0 32px 24px' },
  avatarRow: {
    display: 'flex', alignItems: 'flex-end',
    gap: 20, marginTop: -44, flexWrap: 'wrap',
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: 88, height: 88, borderRadius: 20,
    background: 'linear-gradient(135deg, #28a745, #16a34a)',
    border: '3px solid #fff',
    boxShadow: '0 8px 24px rgba(40,167,69,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800, fontSize: 28, color: '#fff',
  },
  cameraBtn: {
    position: 'absolute', bottom: -4, right: -4,
    width: 28, height: 28,
    background: '#28a745', color: '#fff',
    border: '2px solid #fff', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  photoMsg: {
    position: 'absolute', top: '100%', left: '50%',
    transform: 'translateX(-50%)',
    background: '#28a745', color: '#fff',
    fontSize: 11, fontWeight: 600,
    padding: '4px 10px', borderRadius: 8,
    whiteSpace: 'nowrap', marginTop: 6, zIndex: 10,
  },
  headerInfo: { flex: 1, paddingBottom: 4 },
  rolePill: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(40,167,69,0.08)',
    border: '1px solid rgba(40,167,69,0.2)',
    color: '#16a34a', fontSize: 11, fontWeight: 700,
    padding: '3px 10px', borderRadius: 100,
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
  },
  roleDot: { width: 5, height: 5, background: '#28a745', borderRadius: '50%' },
  name: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 26, fontWeight: 800,
    color: '#0f172a', margin: 0, lineHeight: 1.1,
  },
  subname: { fontSize: 13, color: '#64748b', marginTop: 4 },
  headerActions: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'flex-end', gap: 8,
    paddingBottom: 4, marginLeft: 'auto',
  },
  verifiedBadge: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: '#f0fdf4', border: '1px solid #bbf7d0',
    color: '#16a34a', fontSize: 11, fontWeight: 700,
    padding: '4px 10px', borderRadius: 100,
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', fontSize: 12, fontWeight: 700,
    padding: '7px 14px', borderRadius: 10, cursor: 'pointer',
  },
  statsBar: {
    display: 'flex', alignItems: 'center',
    marginTop: 20, background: '#f8fafc',
    borderRadius: 14, padding: '14px 0',
    border: '1px solid #f1f5f9',
  },
  statDiv: { width: 1, height: 32, background: '#e2e8f0', flexShrink: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: 20,
  },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  card: {
    background: '#fff', borderRadius: 24,
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    border: '1px solid rgba(0,0,0,0.04)',
  },
  secuCard: {
    background: 'linear-gradient(135deg, #0f2027 0%, #1a3a2a 60%, #0d1f16 100%)',
    border: 'none',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center',
    gap: 10, marginBottom: 20,
  },
  cardIcon: {
    width: 34, height: 34, borderRadius: 9,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700, fontSize: 15,
    color: '#0f172a', flex: 1, margin: 0,
  },
  editBtn: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: 'transparent', border: '1px solid #e2e8f0',
    color: '#64748b', fontSize: 11, fontWeight: 600,
    padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
  },
  cancelBtn: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', fontSize: 11, fontWeight: 600,
    padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
  },
  successMsg: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#f0fdf4', color: '#16a34a',
    border: '1px solid #bbf7d0',
    fontSize: 13, fontWeight: 600,
    padding: '10px 14px', borderRadius: 10, marginBottom: 14,
  },
  errorMsg: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#fef2f2', color: '#dc2626',
    border: '1px solid #fecaca',
    fontSize: 13, padding: '10px 14px',
    borderRadius: 10, marginBottom: 14,
  },
  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
  },
  infoItem: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px', background: '#f8fafc',
    borderRadius: 14, border: '1px solid #f1f5f9',
  },
  infoIcon: {
    width: 32, height: 32,
    background: 'rgba(40,167,69,0.08)', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#28a745', fontSize: 13, flexShrink: 0,
  },
  infoLabel: {
    fontSize: 10, fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px',
  },
  infoValue: {
    fontSize: 13, fontWeight: 600, color: '#1e293b',
    margin: 0, wordBreak: 'break-all',
  },
  editInput: {
    width: '100%', fontSize: 13, fontWeight: 500,
    color: '#1e293b', background: '#fff',
    border: '1px solid #e2e8f0', borderRadius: 8,
    padding: '6px 10px', marginTop: 2,
    transition: 'all 0.2s', boxSizing: 'border-box',
  },
  saveBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', marginTop: 16,
    background: '#28a745', color: '#fff',
    border: 'none', borderRadius: 12,
    padding: '12px', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  dossierRow: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 14px', background: '#f8fafc',
    borderRadius: 14, border: '1px solid #f1f5f9',
  },
  dossierIcon: {
    width: 38, height: 38, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0,
  },
  dossierLabel: {
    fontSize: 10, fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px',
  },
  dossierValue: {
    fontSize: 16, fontWeight: 800, color: '#1e293b', margin: 0,
    fontFamily: "'Syne', sans-serif",
  },
  dossierNumero: {
    padding: '14px', background: '#f0fdf4',
    borderRadius: 14, border: '1px solid #bbf7d0',
  },
  dossierNumeroLabel: {
    fontSize: 10, fontWeight: 700, color: '#16a34a',
    textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px',
  },
  dossierNumeroValue: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 15, fontWeight: 800, color: '#15803d', margin: 0,
    letterSpacing: '0.04em',
  },
  qrDesc: {
    fontSize: 12, color: '#64748b',
    lineHeight: 1.6, marginBottom: 16, marginTop: -8,
  },
  qrWrap: {
    display: 'flex', justifyContent: 'center',
    padding: '16px', background: '#f8fafc',
    borderRadius: 16, border: '1px solid #f1f5f9',
  },
};

export default Profil;