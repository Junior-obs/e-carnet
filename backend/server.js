const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'secret_key';

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_carnet'
});

db.connect(err => {
    if (err) { console.error('Erreur MySQL:', err); return; }
    console.log('Connecte a la base e_carnet');
});

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token manquant' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: 'Token invalide' });
    }
};

// ─── AUTH ────────────────────────────────────────────────

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `
        SELECT u.id as utilisateur_id, u.email, u.role,
               COALESCE(p.nom, prof.nom) as nom,
               COALESCE(p.prenom, prof.prenom) as prenom,
               p.id as patient_id,
               prof.id as medecin_id
        FROM utilisateurs u
        LEFT JOIN patients p ON u.id = p.utilisateur_id
        LEFT JOIN professionnels prof ON u.id = prof.utilisateur_id
        WHERE u.email = ? AND u.mot_de_passe = ?`;

    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        if (results.length === 0) return res.status(401).json({ message: "Identifiants incorrects" });

        const user = results[0];
        const profileId = user.role === 'medecin' ? user.medecin_id : user.patient_id;
        const token = jwt.sign(
            { id: user.utilisateur_id, role: user.role, nom: user.nom },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.json({
            success: true, token,
            user: {
                id: user.utilisateur_id,
                profile_id: profileId,
                email: user.email,
                role: user.role,
                nom: user.nom,
                prenom: user.prenom
            }
        });
    });
});

app.post('/api/auth/register', (req, res) => {
    const { nom, prenom, email, password, role, date_naissance, specialite } = req.body;
    const userRole = role === 'medecin' ? 'medecin' : 'patient';

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ message: "Erreur transaction" });

        db.query(
            "INSERT INTO utilisateurs (email, mot_de_passe, role, actif) VALUES (?, ?, ?, 1)",
            [email, password, userRole],
            (err, result) => {
                if (err) return db.rollback(() => res.status(400).json({ message: "Email deja utilise" }));

                const newUserId = result.insertId;
                const sqlProfile = userRole === 'medecin'
                    ? "INSERT INTO professionnels (utilisateur_id, nom, prenom, specialite) VALUES (?, ?, ?, ?)"
                    : "INSERT INTO patients (utilisateur_id, nom, prenom, date_naissance) VALUES (?, ?, ?, ?)";
                const params = userRole === 'medecin'
                    ? [newUserId, nom, prenom, specialite || 'Generaliste']
                    : [newUserId, nom, prenom, date_naissance || '2000-01-01'];

                db.query(sqlProfile, params, (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ message: "Erreur creation profil" }));
                    db.commit(err => {
                        if (err) return db.rollback(() => res.status(500).json({ message: "Erreur finale" }));
                        res.json({ success: true, message: "Compte cree avec succes" });
                    });
                });
            }
        );
    });
});

// ─── RENDEZ-VOUS ─────────────────────────────────────────

app.get('/api/rendezvous/today', authMiddleware, (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    if (req.user.role === 'medecin') {
        const sql = `
            SELECT r.id, r.date_rendezvous, r.motif, r.statut, r.type_consultation, r.duree,
                   p.nom as patient_nom, p.prenom as patient_prenom, p.telephone as patient_telephone
            FROM rendezvous r
            JOIN patients p ON r.patient_id = p.id
            JOIN professionnels prof ON prof.utilisateur_id = ?
            WHERE r.professionnel_id = prof.id
            AND DATE(r.date_rendezvous) = ?
            ORDER BY r.date_rendezvous ASC`;
        db.query(sql, [req.user.id, today], (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(results);
        });
    } else {
        const sql = `
            SELECT r.id, r.date_rendezvous, r.motif, r.statut, r.type_consultation, r.duree,
                   prof.nom as medecin_nom, prof.prenom as medecin_prenom, prof.specialite
            FROM rendezvous r
            JOIN professionnels prof ON r.professionnel_id = prof.id
            JOIN patients p ON p.utilisateur_id = ?
            WHERE r.patient_id = p.id
            AND DATE(r.date_rendezvous) >= ?
            AND r.statut IN ('confirme', 'en_attente')
            ORDER BY r.date_rendezvous ASC
            LIMIT 5`;
        db.query(sql, [req.user.id, today], (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(results);
        });
    }
});

app.post('/api/rendezvous', authMiddleware, (req, res) => {
    const { professionnel_id, date_rendezvous, motif, type_consultation } = req.body;

    db.query("SELECT id FROM patients WHERE utilisateur_id = ?", [req.user.id], (err, results) => {
        if (err || !results.length) return res.status(404).json({ message: "Patient introuvable" });

        const patient_id = results[0].id;
        db.query(
            "INSERT INTO rendezvous (patient_id, professionnel_id, date_rendezvous, motif, type_consultation, statut) VALUES (?, ?, ?, ?, ?, 'en_attente')",
            [patient_id, professionnel_id, date_rendezvous, motif, type_consultation || 'presentiel'],
            (err, result) => {
                if (err) return res.status(500).json({ message: err.message });

                db.query("SELECT utilisateur_id FROM professionnels WHERE id = ?", [professionnel_id], (err, prof) => {
                    if (!err && prof.length) {
                        db.query(
                            "INSERT INTO notifications (utilisateur_id, type, titre, message, lien) VALUES (?, 'rappel_rdv', 'Nouveau rendez-vous', ?, ?)",
                            [prof[0].utilisateur_id, `Nouveau RDV: ${motif}`, `/rendez-vous/${result.insertId}`]
                        );
                    }
                });

                res.json({ success: true, id: result.insertId, message: "Rendez-vous cree" });
            }
        );
    });
});

app.put('/api/rendezvous/:id/statut', authMiddleware, (req, res) => {
    const { statut } = req.body;
    db.query(
        "UPDATE rendezvous SET statut = ? WHERE id = ?",
        [statut, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ success: true });
        }
    );
});

app.put('/api/rendezvous/:id/notes', authMiddleware, (req, res) => {
    const { notes } = req.body;
    db.query(
        "UPDATE rendezvous SET notes = ? WHERE id = ?",
        [notes, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ success: true });
        }
    );
});

app.get('/api/professionnels', authMiddleware, (req, res) => {
    db.query(
        "SELECT id, nom, prenom, specialite, cabinet, telephone FROM professionnels ORDER BY nom",
        (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(results);
        }
    );
});

// ─── PATIENTS DU MEDECIN ─────────────────────────────────

app.get('/api/medecin/patients', authMiddleware, (req, res) => {
    if (req.user.role !== 'medecin') return res.status(403).json({ message: 'Acces refuse' });
    const sql = `
        SELECT DISTINCT p.id, p.nom, p.prenom, p.date_naissance,
                        p.telephone, p.groupe_sanguin, p.adresse
        FROM patients p
        JOIN rendezvous r ON r.patient_id = p.id
        JOIN professionnels prof ON prof.utilisateur_id = ?
        WHERE r.professionnel_id = prof.id
        ORDER BY p.nom`;
    db.query(sql, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
});

// ─── CONSULTATIONS DU MEDECIN ────────────────────────────

app.get('/api/medecin/consultations', authMiddleware, (req, res) => {
    if (req.user.role !== 'medecin') return res.status(403).json({ message: 'Acces refuse' });
    const sql = `
        SELECT r.id, r.date_rendezvous, r.motif, r.statut,
               r.type_consultation, r.duree, r.notes,
               p.nom as patient_nom, p.prenom as patient_prenom,
               p.telephone as patient_telephone
        FROM rendezvous r
        JOIN patients p ON r.patient_id = p.id
        JOIN professionnels prof ON prof.utilisateur_id = ?
        WHERE r.professionnel_id = prof.id
        ORDER BY r.date_rendezvous DESC`;
    db.query(sql, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
});

// ─── NOTIFICATIONS ───────────────────────────────────────

app.get('/api/notifications', authMiddleware, (req, res) => {
    db.query(
        "SELECT * FROM notifications WHERE utilisateur_id = ? ORDER BY date_creation DESC LIMIT 10",
        [req.user.id],
        (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(results);
        }
    );
});

app.put('/api/notifications/:id/lu', authMiddleware, (req, res) => {
    db.query(
        "UPDATE notifications SET lu = 1, date_lu = NOW() WHERE id = ? AND utilisateur_id = ?",
        [req.params.id, req.user.id],
        (err) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ success: true });
        }
    );
});

app.put('/api/notifications/lire-tout', authMiddleware, (req, res) => {
    db.query(
        "UPDATE notifications SET lu = 1, date_lu = NOW() WHERE utilisateur_id = ?",
        [req.user.id],
        (err) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ success: true });
        }
    );
});

// ─── SECURITE ────────────────────────────────────────────

app.put('/api/securite/password', authMiddleware, (req, res) => {
    const { ancien_password, nouveau_password } = req.body;
    db.query(
        "SELECT id FROM utilisateurs WHERE id = ? AND mot_de_passe = ?",
        [req.user.id, ancien_password],
        (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!results.length) return res.status(401).json({ message: "Ancien mot de passe incorrect" });

            db.query(
                "UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?",
                [nouveau_password, req.user.id],
                (err) => {
                    if (err) return res.status(500).json({ message: err.message });
                    res.json({ success: true, message: "Mot de passe mis a jour" });
                }
            );
        }
    );
});

// ─── PATIENTS ────────────────────────────────────────────

app.get('/api/patients/me/profile', authMiddleware, (req, res) => {
    db.query(
        "SELECT p.id, p.nom, p.prenom, p.date_naissance, p.utilisateur_id, p.groupe_sanguin, p.telephone, p.adresse FROM patients p WHERE p.utilisateur_id = ?",
        [req.user.id],
        (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!results.length) return res.status(404).json({ message: 'Patient introuvable' });
            res.json(results[0]);
        }
    );
});

app.get('/api/patients/:id', authMiddleware, (req, res) => {
    if (req.user.role !== 'medecin') return res.status(403).json({ message: 'Acces reserve aux medecins' });
    db.query(
        "SELECT p.id, p.nom, p.prenom, p.date_naissance, p.groupe_sanguin, p.telephone, p.adresse FROM patients p WHERE p.id = ?",
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!results.length) return res.status(404).json({ message: 'Patient introuvable' });
            res.json(results[0]);
        }
    );
});

// ─── MEDECINS ────────────────────────────────────────────

app.get('/api/medecins/me/profile', authMiddleware, (req, res) => {
    db.query(
        `SELECT prof.id, prof.nom, prof.prenom, prof.specialite, prof.telephone, prof.cabinet, u.email
         FROM professionnels prof
         JOIN utilisateurs u ON u.id = prof.utilisateur_id
         WHERE prof.utilisateur_id = ?`,
        [req.user.id],
        (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!results.length) return res.status(404).json({ message: 'Medecin introuvable' });
            res.json(results[0]);
        }
    );
});

app.listen(PORT, () => console.log(`Serveur demarre sur le port ${PORT}`));