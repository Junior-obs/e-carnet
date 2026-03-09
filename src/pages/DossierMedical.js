import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload, FaEye, FaPlus, FaFilter } from 'react-icons/fa';

function DossierMedical({ userRole }) {
  const [dossier, setDossier] = useState(null);
  const [activeTab, setActiveTab] = useState('consultations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement du dossier médical avec des noms sénégalais
    setTimeout(() => {
      setDossier({
        consultations: [
          { id: 1, date: '2026-02-15', medecin: 'Dr. Abdoulaye Sy', diagnostic: 'Paludisme simple', traitement: 'Artéméther/Luméfantrine', notes: 'Repos strict et moustiquaire imprégnée' },
          { id: 2, date: '2026-01-10', medecin: 'Dr. Fatoumata Ndiaye', diagnostic: 'Consultation annuelle', traitement: 'RAS', notes: 'Patient en excellente forme' },
          { id: 3, date: '2025-12-05', medecin: 'Dr. Cheikh Tidiane Sow', diagnostic: 'Hypertension artérielle', traitement: 'Amlodipine 5mg', notes: 'Réduire la consommation de sel et de bouillons' },
        ],
        vaccins: [
          { id: 1, nom: 'Fièvre Jaune', date: '2023-10-05', rappel: '2033-10-05', lot: 'SN-V123', administrateur: 'Inf. Mariama Diallo' },
          { id: 2, nom: 'Hépatite B', date: '2023-11-15', rappel: '2024-11-15', lot: 'DAK-789', administrateur: 'Dr. Ibrahima Fall' },
          { id: 3, nom: 'Méningite', date: '2023-09-20', rappel: '2026-09-20', lot: 'THS-001', administrateur: 'Dr. Moussa Gueye' },
        ],
        allergies: [
          { id: 1, nom: 'Pénicilline', type: 'Médicament', niveau: 'Sévère', symptomes: 'Urticaire, œdème de Quincke' },
          { id: 2, nom: 'Poussière (Harmattan)', type: 'Environnemental', niveau: 'Modéré', symptomes: 'Rhinite allergique, asthme' },
          { id: 3, nom: 'Arachides', type: 'Alimentaire', niveau: 'Léger', symptomes: 'Démangeaisons cutanées' },
        ],
        traitements: [
          { id: 1, nom: 'Coartem', dosage: '20/120mg', frequence: '2 fois par jour', debut: '2026-02-15', fin: '2026-02-18' },
          { id: 2, nom: 'Vitamine C (Orangine)', dosage: '1000mg', frequence: '1 fois par jour', debut: '2026-01-01', fin: '2026-03-31' },
        ],
        analyses: [
          { id: 1, date: '2026-02-10', type: 'Goutte épaisse (GE)', resultat: 'Positif (+)', fichier: 'ge_palu_2026.pdf' },
          { id: 2, date: '2026-01-15', type: 'Bilan lipidique', resultat: 'Normal', fichier: 'bilan_ndiaye.pdf' },
        ],
        constantes: [
          { date: '2026-03-01', taille: 180, poids: 75, tension: '120/80', glycemie: 0.95 },
          { date: '2026-02-01', taille: 180, poids: 76, tension: '145/90', glycemie: 1.10 },
          { date: '2026-01-01', taille: 180, poids: 78, tension: '130/85', glycemie: 1.05 },
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28a745]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800 italic">Dossier Médical Sénégalais</h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all">
            <FaFilter />
            <span>Filtrer</span>
          </button>
          {userRole === 'medecin' && (
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#28a745] text-white rounded-xl hover:bg-green-700 font-bold shadow-lg shadow-green-100 transition-all">
              <FaPlus />
              <span>Nouveau Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-50 overflow-x-auto bg-slate-50/50">
          <nav className="flex space-x-1 p-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all whitespace-nowrap font-bold text-sm ${
                  activeTab === tab.id
                    ? 'bg-white text-[#28a745] shadow-sm border border-slate-100'
                    : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Consultations */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              {dossier.consultations.map((consult) => (
                <div key={consult.id} className="bg-white border border-slate-100 rounded-[1.5rem] p-6 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="bg-green-50 text-[#28a745] px-4 py-1.5 rounded-full text-xs font-black">
                        {new Date(consult.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="font-black text-slate-800 group-hover:text-[#28a745] transition-colors">{consult.medecin}</span>
                    </div>
                    {userRole === 'medecin' && (
                      <button className="text-slate-400 hover:text-[#28a745] p-2">
                        <FaEye />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <p className="text-slate-600 text-sm"><span className="font-bold text-slate-800 block mb-1 uppercase text-[10px] tracking-widest text-[#28a745]">Diagnostic</span> {consult.diagnostic}</p>
                    <p className="text-slate-600 text-sm"><span className="font-bold text-slate-800 block mb-1 uppercase text-[10px] tracking-widest text-[#28a745]">Traitement</span> {consult.traitement}</p>
                  </div>
                  {consult.notes && (
                    <div className="mt-4 pt-4 border-t border-slate-50">
                      <p className="text-slate-500 text-xs italic">Note : {consult.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Vaccins (Mise à jour Sénégal) */}
          {activeTab === 'vaccins' && (
            <div className="grid md:grid-cols-2 gap-4">
              {dossier.vaccins.map((vaccin) => (
                <div key={vaccin.id} className="border border-slate-100 rounded-2xl p-5 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-800">{vaccin.nom}</h3>
                    {new Date(vaccin.rappel) < new Date() ? (
                      <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Rappel dépassé</span>
                    ) : (
                      <span className="bg-green-50 text-[#28a745] px-3 py-1 rounded-lg text-[10px] font-black uppercase">À jour</span>
                    )}
                  </div>
                  <div className="space-y-2 text-xs font-semibold text-slate-500">
                    <p className="flex justify-between"><span>Dernière dose :</span> <span className="text-slate-800">{new Date(vaccin.date).toLocaleDateString('fr-FR')}</span></p>
                    <p className="flex justify-between"><span>Prochain rappel :</span> <span className="text-slate-800">{new Date(vaccin.rappel).toLocaleDateString('fr-FR')}</span></p>
                    <p className="flex justify-between"><span>Administré par :</span> <span className="text-slate-800">{vaccin.administrateur}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Constantes (IMC Calculé) */}
          {activeTab === 'constantes' && (
            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Poids/Taille</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tension</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Glycémie</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut IMC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {dossier.constantes.map((constante, index) => {
                    const imc = (constante.poids / Math.pow(constante.taille/100, 2)).toFixed(1);
                    return (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{new Date(constante.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{constante.poids}kg / {constante.taille}cm</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-700">{constante.tension}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{constante.glycemie} g/L</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                            imc < 18.5 ? 'bg-amber-50 text-amber-600' :
                            imc < 25 ? 'bg-green-50 text-green-600' :
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {imc} - {imc < 25 ? 'Normal' : 'Surpoids'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Ajoutez ici les autres sections (Allergies, Traitements, Analyses) sur le même modèle */}

        </div>
      </div>
    </div>
  );
}

export default DossierMedical;