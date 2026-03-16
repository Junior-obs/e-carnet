import { useAuth } from "../contexts/AuthContext";
import MedecinQR from "../components/MedecinQR";

function MedecinDetails() {
  const { user } = useAuth();

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <h1>Profil du médecin : {user.nom} {user.prenom}</h1>
      <MedecinQR medecinId={user.profile_id} />
    </div>
  );
}

export default MedecinDetails;