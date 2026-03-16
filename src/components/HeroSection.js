import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaUserMd, FaArrowRight, FaQrcode, FaLock } from 'react-icons/fa';

const HeroSection = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -120]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const ecgPath = [
      0,0,0,0,0,0,0,0,0.1,0.2,0.1,0,-0.1,-0.05,
      0,0,0.05,0.1,0.8,1.6,2.0,1.2,0.2,-0.3,-0.5,-0.3,
      0,0.1,0.15,0.1,0.05,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const segments = 3;
      for (let s = 0; s < segments; s++) {
        const offset = (frame + s * (w / segments)) % w;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(40,167,69,${0.15 - s * 0.04})`;
        ctx.lineWidth = 1.5 - s * 0.3;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(40,167,69,0.3)';
        const pts = ecgPath.length;
        for (let x = 0; x < w + 20; x += 4) {
          const idx = Math.floor(((x - offset + w) % w / w) * pts);
          const val = ecgPath[idx] || 0;
          const y = h / 2 - val * (h * 0.22);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      frame = (frame + 1.2) % canvas.width;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const stats = [
    { value: '12K+', label: 'Patients' },
    { value: '850+', label: 'Médecins' },
    { value: '99.9%', label: 'Disponibilité' },
    { value: 'CDP', label: 'Certifié' },
  ];

  const features = [
    {
      icon: <FaHeartbeat />,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.08)',
      title: 'Suivi 24/7',
      desc: 'Données médicales accessibles à tout moment',
    },
    {
      icon: <FaQrcode />,
      color: '#28a745',
      bg: 'rgba(40,167,69,0.08)',
      title: 'QR Patient',
      desc: 'Partage instantané du dossier médical',
    },
    {
      icon: <FaUserMd />,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)',
      title: 'Réseau médical',
      desc: 'Connecté aux professionnels de santé',
    },
    {
      icon: <FaLock />,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      title: 'Données chiffrées',
      desc: 'Conformité CDP Sénégal garantie',
    },
  ];

  return (
    <div ref={containerRef} style={s.page}>

      {/* BG IMAGE */}
      <div style={s.bgWrap}>
        <img src="/hero-bg.jpg" alt="" style={s.bgImg} />
        <div style={s.bgOverlay} />
        <div style={s.bgNoise} />
      </div>

      {/* ECG CANVAS */}
      <canvas ref={canvasRef} style={s.canvas} />

      {/* BLOBS */}
      <motion.div style={{ ...s.blob, ...s.blob1, y: y1 }} />
      <motion.div
        style={{ ...s.blob, ...s.blob2 }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* NAVBAR */}
      <motion.nav
        style={s.nav}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={s.navLogo} onClick={() => navigate('/')}>
          <div style={s.logoMark}>
            <FaHeartbeat style={{ color: '#28a745', fontSize: 20 }} />
          </div>
          <div>
            <div style={s.logoText}>
              E-CARNET<span style={{ color: '#28a745' }}>SANTÉ</span>
            </div>
            <div style={s.logoSub}>Sénégal É-Santé</div>
          </div>
        </div>

        <div style={s.navLinks}>
          {['Fonctionnalités', 'Sécurité', 'À propos'].map(l => (
            <span key={l} style={s.navLink}>{l}</span>
          ))}
        </div>

        <div style={s.navActions}>
          <button style={s.btnOutline} onClick={() => navigate('/login')}>
            Connexion
          </button>
          <button style={s.btnPrimary} onClick={() => navigate('/register')}>
            S'inscrire <FaArrowRight style={{ fontSize: 11 }} />
          </button>
        </div>
      </motion.nav>

      {/* HERO */}
      <motion.div style={{ ...s.hero, opacity }} className="hero-content">

        <motion.div
          style={s.badge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span style={s.badgeDot} />
          Plateforme agréée CDP Sénégal 2026
        </motion.div>

        <motion.h1
          style={s.heading}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          Votre carnet de santé,{' '}
          <span style={s.headingAccent}>partout avec vous</span>
        </motion.h1>

        <motion.p
          style={s.subheading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Dossier médical sécurisé, rendez-vous intelligents et partage
          instantané avec vos médecins — tout en un seul endroit.
        </motion.p>

        <motion.div
          style={s.ctaRow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <motion.button
            style={s.ctaPrimary}
            whileHover={{ scale: 1.04, boxShadow: '0 20px 60px rgba(40,167,69,0.45)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
          >
            Créer mon carnet gratuit
            <FaArrowRight style={{ fontSize: 13 }} />
          </motion.button>

          <motion.button
            style={s.ctaSecondary}
            whileHover={{ background: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
          >
            J'ai déjà un compte
          </motion.button>
        </motion.div>

        <motion.div
          style={s.statsRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          {stats.map((st, i) => (
            <React.Fragment key={st.label}>
              <div style={s.statItem}>
                <div style={s.statValue}>{st.value}</div>
                <div style={s.statLabel}>{st.label}</div>
              </div>
              {i < stats.length - 1 && <div style={s.statDivider} />}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {/* FEATURES */}
      <motion.div
        style={s.featuresStrip}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            style={s.featureCard}
            whileHover={{ y: -4, background: 'rgba(255,255,255,0.1)' }}
            transition={{ delay: i * 0.08 }}
          >
            <div style={{ ...s.featureIcon, background: f.bg, color: f.color }}>
              {f.icon}
            </div>
            <div>
              <div style={s.featureTitle}>{f.title}</div>
              <div style={s.featureDesc}>{f.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-content { text-align: center; }
        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2.4rem !important; }
        }
      `}</style>
    </div>
  );
};

const s = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
    background: '#060d14',
  },
  bgWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    overflow: 'hidden',
  },
  bgImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    opacity: 0.25,
    filter: 'saturate(0.3) brightness(0.6)',
    display: 'block',
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(160deg, rgba(6,13,20,0.88) 0%, rgba(10,24,16,0.80) 50%, rgba(6,13,20,0.95) 100%)',
  },
  bgNoise: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    opacity: 0.4,
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  blob1: {
    width: 500,
    height: 500,
    background: 'radial-gradient(circle, rgba(40,167,69,0.12) 0%, transparent 70%)',
    top: -100,
    left: -100,
  },
  blob2: {
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
    bottom: 100,
    right: -80,
  },
  nav: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: 1180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px 32px 0',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
  },
  logoMark: {
    width: 44,
    height: 44,
    background: 'rgba(40,167,69,0.12)',
    border: '1px solid rgba(40,167,69,0.25)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 17,
    color: '#fff',
    letterSpacing: '-0.02em',
    lineHeight: 1,
  },
  logoSub: {
    fontSize: 9,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  navLinks: {
    display: 'flex',
    gap: 32,
  },
  navLink: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    letterSpacing: '0.01em',
  },
  navActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  btnOutline: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.18)',
    color: 'rgba(255,255,255,0.75)',
    padding: '9px 20px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  btnPrimary: {
    background: '#28a745',
    border: 'none',
    color: '#fff',
    padding: '9px 20px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontFamily: "'DM Sans', sans-serif",
  },
  hero: {
    position: 'relative',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '80px 24px 40px',
    maxWidth: 800,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(40,167,69,0.1)',
    border: '1px solid rgba(40,167,69,0.25)',
    color: '#4ade80',
    fontSize: 12,
    fontWeight: 600,
    padding: '7px 16px',
    borderRadius: 100,
    letterSpacing: '0.03em',
    marginBottom: 28,
  },
  badgeDot: {
    width: 6,
    height: 6,
    background: '#28a745',
    borderRadius: '50%',
    boxShadow: '0 0 8px #28a745',
    display: 'inline-block',
  },
  heading: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '3.8rem',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    marginBottom: 22,
    textAlign: 'center',
  },
  headingAccent: {
    background: 'linear-gradient(135deg, #28a745 0%, #4ade80 60%, #86efac 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subheading: {
    color: 'rgba(255,255,255,0.52)',
    fontSize: 17,
    lineHeight: 1.7,
    maxWidth: 560,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 400,
  },
  ctaRow: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 52,
  },
  ctaPrimary: {
    background: 'linear-gradient(135deg, #28a745, #16a34a)',
    color: '#fff',
    border: 'none',
    padding: '15px 32px',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 12px 40px rgba(40,167,69,0.3)',
    fontFamily: "'DM Sans', sans-serif",
  },
  ctaSecondary: {
    background: 'rgba(255,255,255,0.07)',
    color: 'rgba(255,255,255,0.75)',
    border: '1px solid rgba(255,255,255,0.12)',
    padding: '15px 32px',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  statItem: {
    padding: '16px 28px',
    textAlign: 'center',
  },
  statValue: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 22,
    color: '#fff',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    background: 'rgba(255,255,255,0.07)',
  },
  featuresStrip: {
    position: 'relative',
    zIndex: 5,
    display: 'flex',
    width: '100%',
    maxWidth: 1000,
    margin: '0 24px 40px',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  featureCard: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '22px',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    cursor: 'default',
    transition: 'all 0.25s',
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 17,
    flexShrink: 0,
  },
  featureTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    lineHeight: 1,
    fontFamily: "'Syne', sans-serif",
    marginBottom: 5,
  },
  featureDesc: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 11,
    lineHeight: 1.4,
  },
};

export default HeroSection;