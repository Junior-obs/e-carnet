// src/components/PatientQR.jsx
import QRCode from "react-qr-code";

function PatientQR({ patientId }) {
  return (
    <div className="text-center my-4">
      <QRCode 
        value={patientId} 
        size={150} 
        bgColor="#ffffff" 
        fgColor="#000000" 
      />
      <p>ID Patient : {patientId}</p>
    </div>
  );
}

export default PatientQR;