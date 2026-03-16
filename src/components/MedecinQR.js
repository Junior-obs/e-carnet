import QRCode from "react-qr-code";

function MedecinQR({ medecinId }) {
  const validMedecinId = medecinId || '0000';

  // IP fixe au lieu de window.location.origin
  const qrValue = `http://192.168.1.16:3000/profil-medecin?medecinId=${validMedecinId}`;

  return (
    <div className="mt-6 flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-gray-500 mb-2">QR Code du Médecin</h3>
      <QRCode value={qrValue} size={120} bgColor="#ffffff" fgColor="#000000" />
      <span className="text-xs text-gray-400 mt-2">{`ID: ${validMedecinId}`}</span>
    </div>
  );
}

export default MedecinQR;