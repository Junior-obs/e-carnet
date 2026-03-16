import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PatientProfil() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!patientId) return;
    const token = localStorage.getItem("token");

    if (!token) {
      // Sauvegarder l'URL cible et rediriger vers login
      localStorage.setItem('redirect_after_login', `/profil-patient?patientId=${patientId}`);
      navigate('/login');
      return;
    }

    axios.get(`http://192.168.1.16:5000/api/patients/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => { setPatient(res.data); setLoading(false); })
    .catch(err => {
      setError(err.response?.data?.message || "Erreur lors du chargement.");
      setLoading(false);
    });
  }, [patientId, navigate]);

  if (loading && !error) return <p className="p-6 text-gray-500">Chargement...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!patient) return null;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        {patient.prenom} {patient.nom}
      </h1>
      <p className="text-sm text-gray-400 mb-6">ID Patient : {patient.id}</p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Date de naissance</p>
          <p className="font-medium text-gray-700">{patient.date_naissance || '—'}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Spécialité</p>
          <p className="font-medium text-gray-700">{patient.specialite || '—'}</p>
        </div>
      </div>
    </div>
  );
}

export default PatientProfil;