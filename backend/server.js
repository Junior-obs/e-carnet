const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Par défaut sur XAMPP
    database: 'e_carnet'
});

db.connect(err => {
    if (err) {
        console.error('❌ Erreur MySQL:', err);
        return;
    }
    console.log('✅ Connecté à la base e_carnet');
});

// --- LOGIN : Vérifie l'email/pass et récupère le profil ---
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const sql = `
        SELECT u.id, u.email, u.role, 
               COALESCE(p.nom, prof.nom) as nom, 
               COALESCE(p.prenom, prof.prenom) as prenom
        FROM utilisateurs u
        LEFT JOIN patients p ON u.id = p.utilisateur_id
        LEFT JOIN professionnels prof ON u.id = prof.utilisateur_id
        WHERE u.email = ? AND u.mot_de_passe = ?`;

    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ message: "Identifiants incorrects" });
        }
    });
});

// --- REGISTER : Crée l'utilisateur ET le profil (Patient ou Médecin) ---
app.post('/api/auth/register', (req, res) => {
    const { nom, prenom, email, password, role, date_naissance, specialite } = req.body;
    const userRole = role === 'medecin' ? 'medecin' : 'patient';

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ message: "Erreur transaction" });

        // 1. Insertion dans la table utilisateurs
        const sqlUser = "INSERT INTO utilisateurs (email, mot_de_passe, role, actif) VALUES (?, ?, ?, 1)";
        db.query(sqlUser, [email, password, userRole], (err, result) => {
            if (err) {
                return db.rollback(() => res.status(400).json({ message: "Email déjà utilisé" }));
            }

            const newUserId = result.insertId;
            let sqlProfile = "";
            let params = [];

            // 2. Insertion dans la table de profil correspondante
            if (userRole === 'medecin') {
                sqlProfile = "INSERT INTO professionnels (utilisateur_id, nom, prenom, specialite) VALUES (?, ?, ?, ?)";
                params = [newUserId, nom, prenom, specialite || 'Généraliste'];
            } else {
                sqlProfile = "INSERT INTO patients (utilisateur_id, nom, prenom, date_naissance) VALUES (?, ?, ?, ?)";
                params = [newUserId, nom, prenom, date_naissance || '2000-01-01'];
            }

            db.query(sqlProfile, params, (err) => {
                if (err) {
                    return db.rollback(() => res.status(500).json({ message: "Erreur création profil" }));
                }

                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ message: "Erreur finale" }));
                    res.json({ success: true, message: "Compte créé avec succès" });
                });
            });
        });
    });
});

app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));