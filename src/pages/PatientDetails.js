import { useAuth } from "../contexts/AuthContext";
import PatientQR from "../components/PatientQR";

function PatientDetails() {
  const { user } = useAuth();

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <h1>Dossier du patient : {user.nom} {user.prenom}</h1>
      <PatientQR patientId={user.profile_id} />
    </div>
  );
}

export default PatientDetails;