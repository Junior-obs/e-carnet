import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPaperPlane, FaTrash, FaReply, FaUser, FaSearch } from 'react-icons/fa';

function Messagerie({ userRole }) {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    // Simuler le chargement des messages
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          expediteur: 'Dr. Martin',
          expediteurRole: 'medecin',
          destinataire: 'Jean Dupont',
          sujet: 'Résultats d\'analyse',
          contenu: 'Bonjour, vos résultats d\'analyse sont disponibles. Ils sont normaux. Je vous invite à prendre rendez-vous pour en discuter.',
          date: '2024-03-10T14:30:00',
          lu: false,
          pieceJointe: 'resultats_analyse.pdf'
        },
        {
          id: 2,
          expediteur: 'Dr. Bernard',
          expediteurRole: 'medecin',
          destinataire: 'Jean Dupont',
          sujet: 'Confirmation rendez-vous',
          contenu: 'Votre rendez-vous du 15 mars à 14h30 est confirmé. Merci de vous présenter 10 minutes avant.',
          date: '2024-03-09T09:15:00',
          lu: true
        },
        {
          id: 3,
          expediteur: 'Jean Dupont',
          expediteurRole: 'patient',
          destinataire: 'Dr. Martin',
          sujet: 'Question traitement',
          contenu: 'Bonjour Dr. Martin, j\'ai une question concernant mon traitement. Est-ce que je peux le prendre avec de la nourriture ?',
          date: '2024-03-08T11:00:00',
          lu: true
        },
        {
          id: 4,
          expediteur: 'Secrétariat',
          expediteurRole: 'secretaire',
          destinataire: 'Jean Dupont',
          sujet: 'Rappel vaccination',
          contenu: 'Nous vous rappelons que votre vaccination contre la grippe est prévue dans 15 jours.',
          date: '2024-03-07T16:20:00',
          lu: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const nouveauMessage = {
        id: messages.length + 1,
        expediteur: userRole === 'patient' ? 'Jean Dupont' : 'Dr. Martin',
        expediteurRole: userRole,
        destinataire: replyTo ? replyTo.expediteur : 'Dr. Martin',
        sujet: replyTo ? `Re: ${replyTo.sujet}` : 'Nouveau message',
        contenu: newMessage,
        date: new Date().toISOString(),
        lu: true
      };
      setMessages([nouveauMessage, ...messages]);
      setNewMessage('');
      setShowCompose(false);
      setReplyTo(null);
    }
  };

  const marquerCommeLu = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, lu: true } : msg
    ));
  };

  const handleReply = (message) => {
    setReplyTo(message);
    setShowCompose(true);
  };

  const filteredMessages = messages.filter(msg =>
    msg.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.expediteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.contenu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnreadCount = () => {
    return messages.filter(m => !m.lu && m.expediteurRole !== userRole).length;
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Messagerie</h1>
        <div className="flex items-center space-x-3">
          {getUnreadCount() > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              {getUnreadCount()} non lu(s)
            </span>
          )}
          <button
            onClick={() => {
              setShowCompose(!showCompose);
              setReplyTo(null);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FaEnvelope />
            <span>Nouveau message</span>
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input-field"
        />
      </div>

      {/* Formulaire nouveau message */}
      {showCompose && (
        <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {replyTo ? `Répondre à ${replyTo.expediteur}` : 'Nouveau message'}
          </h2>
          <form onSubmit={handleSendMessage} className="space-y-4">
            {!replyTo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                <select className="input-field" required>
                  <option value="">Sélectionner un destinataire</option>
                  <option value="Dr. Martin">Dr. Martin - Médecine générale</option>
                  <option value="Dr. Bernard">Dr. Bernard - Cardiologie</option>
                  <option value="Dr. Dubois">Dr. Dubois - Dermatologie</option>
                  <option value="Secrétariat">Secrétariat</option>
                </select>
              </div>
            )}
            {!replyTo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Objet du message"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="input-field"
                rows="5"
                placeholder="Votre message..."
                required
              ></textarea>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <FaPaperPlane />
                <span>Envoyer</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCompose(false);
                  setReplyTo(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des messages */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-800">Tous les messages</h3>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  marquerCommeLu(message.id);
                }}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-primary-50' : ''
                } ${!message.lu && message.expediteurRole !== userRole ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    message.expediteurRole === 'medecin' ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    <FaUser className={message.expediteurRole === 'medecin' ? 'text-primary-600' : 'text-gray-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-800 truncate">{message.expediteur}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(message.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 truncate">{message.sujet}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{message.contenu}</p>
                  </div>
                  {!message.lu && message.expediteurRole !== userRole && (
                    <span className="bg-primary-500 w-2 h-2 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Détail du message */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{selectedMessage.sujet}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    <FaReply />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
                <div className={`p-3 rounded-full ${
                  selectedMessage.expediteurRole === 'medecin' ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <FaUser className={selectedMessage.expediteurRole === 'medecin' ? 'text-primary-600' : 'text-gray-600'} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{selectedMessage.expediteur}</p>
                  <p className="text-sm text-gray-500">
                    {selectedMessage.expediteurRole === 'medecin' ? 'Médecin' : 'Patient'} • {new Date(selectedMessage.date).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 whitespace-pre-line">{selectedMessage.contenu}</p>
              </div>

              {selectedMessage.pieceJointe && (
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-600">📎 {selectedMessage.pieceJointe}</span>
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    Télécharger
                  </button>
                </div>
              )}

              {/* Réponse rapide */}
              <div className="mt-4 pt-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrire une réponse..."
                    className="flex-1 input-field"
                  />
                  <button type="submit" className="btn-primary px-4">
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Aucun message sélectionné</h3>
              <p className="text-gray-500">Cliquez sur un message pour lire son contenu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messagerie;