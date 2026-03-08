// backend/server.js - Projet e-carnet
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MySQL (XAMPP)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_carnet'    // Nom de la base de données adapté
});

// Connexion à la base de données
db.connect(err => {
    if (err) {
        console.error('❌ Erreur de connexion à MySQL:', err);
        return;
    }
    console.log('✅ Connecté à MySQL - Base de données: e_carnet');
});

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '🚀 Le serveur e-carnet fonctionne!',
        status: 'OK',
        timestamp: new Date()
    });
});

// Route pour récupérer tous les patients
app.get('/api/patients', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Route pour ajouter un patient
app.post('/api/patients', (req, res) => {
    const { nom, prenom, date_naissance, email, telephone } = req.body;
    
    db.query(
        'INSERT INTO patients (nom, prenom, date_naissance, email, telephone) VALUES (?, ?, ?, ?, ?)',
        [nom, prenom, date_naissance, email, telephone],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: result.insertId, ...req.body });
        }
    );
});

// Route pour récupérer les dossiers médicaux d'un patient
app.get('/api/dossiers/:patientId', (req, res) => {
    const patientId = req.params.patientId;
    
    db.query(
        'SELECT * FROM dossiers_medicaux WHERE patient_id = ?',
        [patientId],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(results);
        }
    );
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur e-carnet démarré sur http://localhost:${PORT}`);
    console.log(`📝 Routes disponibles:`);
    console.log(`   - GET  /api/test`);
    console.log(`   - GET  /api/patients`);
    console.log(`   - POST /api/patients`);
    console.log(`   - GET  /api/dossiers/:patientId`);
});