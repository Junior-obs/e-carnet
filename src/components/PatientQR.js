import QRCode from "react-qr-code";

function PatientQR({ patientId }) {
  const validPatientId = patientId || '0000';
  
  // IP fixe au lieu de window.location.origin
  const qrValue = `http://192.168.1.16:3000/profil-patient?patientId=${validPatientId}`;

  return (
    <div className="mt-6 flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-gray-500 mb-2">QR Code du Patient</h3>
      <QRCode value={qrValue} size={120} bgColor="#ffffff" fgColor="#000000" />
      <span className="text-xs text-gray-400 mt-2">{`ID: ${validPatientId}`}</span>
    </div>
  );
}

export default PatientQR;