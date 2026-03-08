import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload, FaEye, FaPlus, FaFilter } from 'react-icons/fa';

function DossierMedical({ userRole }) {
  const [dossier, setDossier] = useState(null);
  const [activeTab, setActiveTab] = useState('consultations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement du dossier médical
    setTimeout(() => {
      setDossier({
        consultations: [
          { id: 1, date: '2024-02-15', medecin: 'Dr. Martin', diagnostic: 'Rhume', traitement: 'Paracétamol 1000mg', notes: 'Repos pendant 3 jours' },
          { id: 2, date: '2024-01-10', medecin: 'Dr. Bernard', diagnostic: 'Consultation annuelle', traitement: 'RAS', notes: 'Patient en bonne santé' },
          { id: 3, date: '2023-12-05', medecin: 'Dr. Dubois', diagnostic: 'Tension artérielle', traitement: 'Traitement hypotenseur', notes: 'Surveillance mensuelle' },
        ],
        vaccins: [
          { id: 1, nom: 'DTP', date: '2023-10-05', rappel: '2028-10-05', lot: 'ABC123', administrateur: 'Dr. Martin' },
          { id: 2, nom: 'Grippe', date: '2023-11-15', rappel: '2024-11-15', lot: 'XYZ789', administrateur: 'Dr. Bernard' },
          { id: 3, nom: 'COVID-19', date: '2023-09-20', rappel: '2024-09-20', lot: 'VAC001', administrateur: 'Dr. Dubois' },
        ],
        allergies: [
          { id: 1, nom: 'Pénicilline', type: 'Médicament', niveau: 'Sévère', symptomes: 'Urticaire, difficulté respiratoire' },
          { id: 2, nom: 'Pollens', type: 'Environnemental', niveau: 'Modéré', symptomes: 'Éternuements, yeux rouges' },
          { id: 3, nom: 'Arachides', type: 'Alimentaire', niveau: 'Léger', symptomes: 'Démangeaisons' },
        ],
        traitements: [
          { id: 1, nom: 'Paracétamol', dosage: '1000mg', frequence: '3 fois par jour', debut: '2024-02-15', fin: '2024-02-22' },
          { id: 2, nom: 'Vitamine D', dosage: '1000 UI', frequence: '1 fois par jour', debut: '2024-01-01', fin: '2024-12-31' },
        ],
        analyses: [
          { id: 1, date: '2024-02-10', type: 'Analyse sanguine', resultat: 'Normal', fichier: 'analyse_fev2024.pdf' },
          { id: 2, date: '2024-01-15', type: 'Radio thoracique', resultat: 'Normal', fichier: 'radio_jan2024.pdf' },
        ],
        constantes: [
          { date: '2024-03-01', taille: 175, poids: 70, tension: '120/80', glycemie: 0.95 },
          { date: '2024-02-01', taille: 175, poids: 71, tension: '125/85', glycemie: 1.02 },
          { date: '2024-01-01', taille: 175, poids: 72, tension: '130/85', glycemie: 1.05 },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'consultations', label: 'Consultations', icon: '📋' },
    { id: 'vaccins', label: 'Vaccins', icon: '💉' },
    { id: 'allergies', label: 'Allergies', icon: '⚠️' },
    { id: 'traitements', label: 'Traitements', icon: '💊' },
    { id: 'analyses', label: 'Analyses', icon: '🔬' },
    { id: 'constantes', label: 'Constantes', icon: '📊' },
  ];

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
        <h1 className="text-2xl font-bold text-gray-800">Dossier Médical</h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FaFilter className="text-gray-600" />
            <span>Filtrer</span>
          </button>
          {userRole === 'medecin' && (
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <FaPlus />
              <span>Ajouter</span>
            </button>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b overflow-x-auto">
          <nav className="flex space-x-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Consultations */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              {dossier.consultations.map((consult) => (
                <div key={consult.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                        {new Date(consult.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="font-medium text-gray-800">{consult.medecin}</span>
                    </div>
                    {userRole === 'medecin' && (
                      <button className="text-primary-600 hover:text-primary-700">
                        <FaEye />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700"><span className="font-medium">Diagnostic:</span> {consult.diagnostic}</p>
                  <p className="text-gray-700"><span className="font-medium">Traitement:</span> {consult.traitement}</p>
                  {consult.notes && (
                    <p className="text-gray-600 text-sm mt-2">{consult.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Vaccins */}
          {activeTab === 'vaccins' && (
            <div className="space-y-4">
              {dossier.vaccins.map((vaccin) => (
                <div key={vaccin.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{vaccin.nom}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <p><span className="text-gray-600">Date:</span> {new Date(vaccin.date).toLocaleDateString('fr-FR')}</p>
                        <p><span className="text-gray-600">Rappel:</span> {new Date(vaccin.rappel).toLocaleDateString('fr-FR')}</p>
                        <p><span className="text-gray-600">Lot:</span> {vaccin.lot}</p>
                        <p><span className="text-gray-600">Administrateur:</span> {vaccin.administrateur}</p>
                      </div>
                    </div>
                    {new Date(vaccin.rappel) < new Date() ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">Rappel dépassé</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">À jour</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Allergies */}
          {activeTab === 'allergies' && (
            <div className="space-y-4">
              {dossier.allergies.map((allergie) => (
                <div key={allergie.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{allergie.nom}</h3>
                      <p className="text-sm text-gray-600">{allergie.type}</p>
                      <p className="text-sm text-gray-600 mt-2">{allergie.symptomes}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      allergie.niveau === 'Sévère' ? 'bg-red-100 text-red-700' :
                      allergie.niveau === 'Modéré' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {allergie.niveau}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Traitements */}
          {activeTab === 'traitements' && (
            <div className="space-y-4">
              {dossier.traitements.map((traitement) => (
                <div key={traitement.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{traitement.nom}</h3>
                      <p className="text-sm text-gray-600">{traitement.dosage} - {traitement.frequence}</p>
                      <p className="text-sm text-gray-600">
                        Du {new Date(traitement.debut).toLocaleDateString('fr-FR')} au {new Date(traitement.fin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {new Date(traitement.fin) < new Date() ? (
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Terminé</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">En cours</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analyses */}
          {activeTab === 'analyses' && (
            <div className="space-y-4">
              {dossier.analyses.map((analyse) => (
                <div key={analyse.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{analyse.type}</h3>
                      <p className="text-sm text-gray-600">Date: {new Date(analyse.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-600">Résultat: {analyse.resultat}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                        <FaEye />
                      </button>
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Constantes */}
          {activeTab === 'constantes' && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Taille</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Poids</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Tension</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Glycémie</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">IMC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dossier.constantes.map((constante, index) => {
                    const imc = (constante.poids / Math.pow(constante.taille/100, 2)).toFixed(1);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-800">{new Date(constante.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{constante.taille} cm</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{constante.poids} kg</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{constante.tension}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{constante.glycemie} g/L</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            imc < 18.5 ? 'bg-yellow-100 text-yellow-700' :
                            imc < 25 ? 'bg-green-100 text-green-700' :
                            imc < 30 ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {imc}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DossierMedical;