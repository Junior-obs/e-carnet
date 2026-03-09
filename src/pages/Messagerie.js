import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, FaPaperPlane, FaTrash, FaReply, FaUser, 
  FaSearch, FaPaperclip, FaFilePdf, FaFileImage, 
  FaFileWord, FaFileExcel, FaDownload, FaEye,
  FaCheckCircle, FaClock, FaBell, FaArchive,
  FaFilter, FaSort, FaStar, FaCheck,
  FaPhone, FaVideo, FaEllipsisH, FaRegSmile
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Messagerie() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, starred
  const [composeData, setComposeData] = useState({
    destinataire: '',
    sujet: '',
    message: '',
    pieceJointe: null
  });
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Simulation des données enrichies avec noms sénégalais
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          expediteur: 'Dr. Abdoulaye Diouf',
          expediteurRole: 'medecin',
          destinataire: 'Moussa Traoré',
          avatar: 'AD',
          sujet: '🔬 Résultats d\'analyse - Labo Pasteur Dakar',
          contenu: `Bonjour Moussa,

Je fais suite à votre bilan sanguin réalisé le 5 mars au Laboratoire Pasteur de Dakar. 

**Résultats principaux :**
- Glycémie : 0.95 g/L (normal)
- Cholestérol total : 2.10 g/L (légèrement élevé)
- Triglycérides : 1.20 g/L (normal)
- Hémoglobine : 14.5 g/dL (normal)

Je vous propose de passer au cabinet pour discuter de ces résultats et ajuster votre alimentation si nécessaire.

Cordialement,
Dr. Abdoulaye Diouf`,
          date: '2024-03-10T14:30:00',
          lu: false,
          important: true,
          starred: true,
          attachments: [
            { name: 'resultats_analyse_sang.pdf', size: '2.4 MB', type: 'pdf' },
            { name: 'graphique_glycemie.png', size: '1.1 MB', type: 'image' }
          ]
        },
        {
          id: 2,
          expediteur: 'Clinique de la Madeleine',
          expediteurRole: 'etablissement',
          destinataire: 'Moussa Traoré',
          avatar: 'CM',
          sujet: '📅 Confirmation RDV - Dr. Fatou Ndiaye',
          contenu: `Bonjour Moussa,

Nous vous confirmons votre rendez-vous avec le Dr. Fatou Ndiaye :

**📆 Date :** Vendredi 15 mars 2024
**⏰ Heure :** 14h30
**📍 Lieu :** Clinique de la Madeleine, 3e étage - Cabinet 312

Merci de vous présenter 10 minutes avant l'heure du rendez-vous avec :
- Votre carte d'identité
- Votre carte vitale
- Votre carnet de santé

Pour toute modification, contactez-nous au 33 123 45 67.

Cordialement,
Le secrétariat`,
          date: '2024-03-09T09:15:00',
          lu: true,
          important: false,
          starred: false
        },
        {
          id: 3,
          expediteur: 'Pharmacie du Plateau',
          expediteurRole: 'pharmacie',
          destinataire: 'Moussa Traoré',
          avatar: 'PP',
          sujet: '💊 Votre ordonnance est prête',
          contenu: `Bonjour Moussa,

Nous vous informons que votre traitement est disponible à la Pharmacie du Plateau.

**Médicaments :**
- Amoxicilline 500mg - 1 boîte
- Paracétamol 1000mg - 2 boîtes
- Vitamine C - 1 boîte

**Montant à régler :** 15 500 FCFA
**Prise en charge :** 70% par votre mutuelle

N'oubliez pas votre carte vitale et votre carte de mutuelle.

À bientôt,
L'équipe de la Pharmacie du Plateau`,
          date: '2024-03-08T11:30:00',
          lu: false,
          important: false,
          starred: true,
          attachments: [
            { name: 'ordonnance.pdf', size: '0.5 MB', type: 'pdf' }
          ]
        },
        {
          id: 4,
          expediteur: 'Dr. Awa Seck',
          expediteurRole: 'medecin',
          destinataire: 'Moussa Traoré',
          avatar: 'AS',
          sujet: '🏥 Compte-rendu de consultation',
          contenu: `Bonjour Moussa,

Suite à notre consultation du 3 mars, veuillez trouver ci-joint votre compte-rendu détaillé ainsi que les recommandations pour votre suivi.

**Diagnostic :** Hypertension artérielle légère
**Traitement prescrit :** Amlodipine 5mg, 1 comprimé par jour
**Prochain rendez-vous :** Dans 3 mois

N'hésitez pas à me contacter en cas de questions.

Bien cordialement,
Dr. Awa Seck
Cardiologue`,
          date: '2024-03-05T16:45:00',
          lu: true,
          important: true,
          starred: true,
          attachments: [
            { name: 'compte_rendu_consultation.pdf', size: '1.8 MB', type: 'pdf' },
            { name: 'ordonnance_amlodipine.pdf', size: '0.3 MB', type: 'pdf' }
          ]
        },
        {
          id: 5,
          expediteur: 'Moussa Traoré',
          expediteurRole: 'patient',
          destinataire: 'Dr. Abdoulaye Diouf',
          avatar: 'MT',
          sujet: 'Question sur mon traitement',
          contenu: `Bonjour Docteur,

J'ai une question concernant mon traitement. Je dois prendre le médicament matin et soir, mais j'oublie parfois le soir. Est-ce que je peux prendre les deux doses le matin ?

Merci pour votre réponse.

Cordialement,
Moussa Traoré`,
          date: '2024-03-04T08:20:00',
          lu: true,
          important: false,
          starred: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleReply = (message) => {
    setReplyTo(message);
    setShowCompose(true);
    setComposeData({
      destinataire: message.expediteur,
      sujet: `Re: ${message.sujet}`,
      message: '',
      pieceJointe: null
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (composeData.message.trim() || composeData.pieceJointe) {
      const nouveauMessage = {
        id: messages.length + 1,
        expediteur: user?.prenom ? `${user.prenom} ${user.nom}` : 'Moussa Traoré',
        expediteurRole: user?.role || 'patient',
        avatar: user?.prenom?.[0] + user?.nom?.[0],
        destinataire: composeData.destinataire || 'Dr. Abdoulaye Diouf',
        sujet: composeData.sujet || 'Nouveau message',
        contenu: composeData.message,
        date: new Date().toISOString(),
        lu: true,
        important: false,
        starred: false,
        attachments: composeData.pieceJointe ? [composeData.pieceJointe] : []
      };
      setMessages([nouveauMessage, ...messages]);
      setComposeData({ destinataire: '', sujet: '', message: '', pieceJointe: null });
      setShowCompose(false);
      setReplyTo(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComposeData({
        ...composeData,
        pieceJointe: {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type.split('/')[1]
        }
      });
    }
  };

  const toggleStar = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, lu: true } : msg
    ));
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type.includes('image')) return <FaFileImage className="text-green-500" />;
    if (type.includes('word')) return <FaFileWord className="text-blue-500" />;
    if (type.includes('excel')) return <FaFileExcel className="text-green-700" />;
    return <FaPaperclip className="text-gray-500" />;
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.expediteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.contenu.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'unread') return !msg.lu && matchesSearch;
    if (filter === 'starred') return msg.starred && matchesSearch;
    return matchesSearch;
  });

  const unreadCount = messages.filter(m => !m.lu).length;
  const starredCount = messages.filter(m => m.starred).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
          />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Chargement de votre messagerie</h3>
          <p className="text-slate-500">Connexion sécurisée en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* EN-TÊTE */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <FaEnvelope className="text-blue-600" />
              Messagerie médicale
            </h1>
            <p className="text-slate-500 mt-2">Échangez en toute sécurité avec vos professionnels de santé</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Statistiques */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span className="text-sm font-medium text-slate-600">{unreadCount} non lu{unreadCount > 1 ? 's' : ''}</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="text-sm font-medium text-slate-600">{starredCount} important{starredCount > 1 ? 's' : ''}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowCompose(true);
                setReplyTo(null);
                setComposeData({ destinataire: '', sujet: '', message: '', pieceJointe: null });
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all flex items-center gap-3"
            >
              <FaEnvelope />
              Nouveau message
            </motion.button>
          </div>
        </motion.div>

        {/* FILTRES ET RECHERCHE */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-white/50"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${filter === 'unread' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <FaBell className="text-sm" />
              Non lus
              {unreadCount > 0 && <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>}
            </button>
            <button
              onClick={() => setFilter('starred')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${filter === 'starred' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <FaStar />
              Importants
            </button>
          </div>

          <div className="flex-1 max-w-md relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un message, un expéditeur..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* GRILLE PRINCIPALE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
          
          {/* LISTE DES CONVERSATIONS */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/50 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Conversations</h3>
              <div className="space-y-2">
                {filteredMessages.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">Aucun message trouvé</p>
                ) : (
                  filteredMessages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedMessage(msg);
                        markAsRead(msg.id);
                      }}
                      className={`p-4 rounded-2xl cursor-pointer transition-all ${
                        selectedMessage?.id === msg.id 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200' 
                          : 'hover:bg-slate-50 border border-transparent'
                      } ${!msg.lu ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                          {msg.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-slate-800 truncate">{msg.expediteur}</p>
                            <div className="flex items-center gap-2">
                              {msg.important && <span className="w-1 h-1 bg-red-500 rounded-full" />}
                              {!msg.lu && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-slate-600 truncate">{msg.sujet}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(msg.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        {msg.starred && (
                          <FaStar className="text-yellow-400 text-sm shrink-0" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* CONTENU DU MESSAGE SÉLECTIONNÉ */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8 flex flex-col"
          >
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key="message-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/50 h-full flex flex-col overflow-hidden"
                >
                  {/* En-tête du message */}
                  <div className="p-8 border-b border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {selectedMessage.avatar}
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-slate-800">{selectedMessage.expediteur}</h2>
                          <p className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1">
                              <FaClock className="text-xs" />
                              {new Date(selectedMessage.date).toLocaleString('fr-FR', { 
                                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
                              })}
                            </span>
                            {selectedMessage.important && (
                              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                Important
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleStar(selectedMessage.id)}
                          className={`p-3 rounded-xl transition-all ${
                            selectedMessage.starred 
                              ? 'bg-yellow-100 text-yellow-600' 
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <FaStar />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleReply(selectedMessage)}
                          className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all"
                        >
                          <FaReply />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Corps du message */}
                  <div className="flex-1 p-8 overflow-y-auto">
                    <h3 className="text-xl font-black text-slate-800 mb-6">{selectedMessage.sujet}</h3>
                    <div className="prose prose-blue max-w-none">
                      <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                        {selectedMessage.contenu}
                      </p>
                    </div>

                    {/* Pièces jointes */}
                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                      <div className="mt-8">
                        <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <FaPaperclip className="text-blue-500" />
                          Pièces jointes ({selectedMessage.attachments.length})
                        </h4>
                        <div className="space-y-3">
                          {selectedMessage.attachments.map((file, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ x: 5 }}
                              className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                                  {getFileIcon(file.type)}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{file.name}</p>
                                  <p className="text-xs text-slate-500">{file.size}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                  <FaEye />
                                </button>
                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all">
                                  <FaDownload />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Réponse rapide */}
                  <div className="p-6 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <form onSubmit={handleSendMessage} className="flex gap-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre réponse ici..."
                        className="flex-1 px-6 py-4 bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                      >
                        <FaPaperPlane />
                        Envoyer
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-dashed border-slate-300 h-full flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6">
                    <FaEnvelope className="text-4xl text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-3">Aucun message sélectionné</h3>
                  <p className="text-slate-500 max-w-md mb-8">
                    Choisissez une conversation dans la liste de gauche pour commencer à lire vos messages
                  </p>
                  <button
                    onClick={() => {
                      setShowCompose(true);
                      setReplyTo(null);
                    }}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                  >
                    ✍️ Écrire un nouveau message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* MODAL DE COMPOSITION */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCompose(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <h2 className="text-2xl font-black mb-2">
                  {replyTo ? `Répondre à ${replyTo.expediteur}` : 'Nouveau message'}
                </h2>
                <p className="text-blue-100 text-sm">
                  Tous les messages sont chiffrés de bout en bout
                </p>
              </div>

              <form onSubmit={handleSendMessage} className="p-8 space-y-6">
                {!replyTo && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Destinataire</label>
                      <select
                        value={composeData.destinataire}
                        onChange={(e) => setComposeData({...composeData, destinataire: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      >
                        <option value="">Sélectionner un destinataire</option>
                        <option value="Dr. Abdoulaye Diouf">Dr. Abdoulaye Diouf - Médecine générale</option>
                        <option value="Dr. Awa Seck">Dr. Awa Seck - Cardiologie</option>
                        <option value="Dr. Fatou Ndiaye">Dr. Fatou Ndiaye - Pédiatrie</option>
                        <option value="Clinique de la Madeleine">Clinique de la Madeleine</option>
                        <option value="Pharmacie du Plateau">Pharmacie du Plateau</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Objet</label>
                      <input
                        type="text"
                        value={composeData.sujet}
                        onChange={(e) => setComposeData({...composeData, sujet: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Objet du message"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea
                    value={composeData.message}
                    onChange={(e) => setComposeData({...composeData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400 min-h-[200px]"
                    placeholder="Votre message..."
                    required
                  />
                </div>

                {/* Pièce jointe */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <FaPaperclip />
                    <span className="text-sm font-medium">Joindre un fichier</span>
                  </button>
                  {composeData.pieceJointe && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-xl flex items-center justify-between">
                      <span className="text-sm text-blue-700">{composeData.pieceJointe.name}</span>
                      <button
                        type="button"
                        onClick={() => setComposeData({...composeData, pieceJointe: null})}
                        className="text-red-500 text-sm"
                      >
                        Retirer
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                  >
                    <FaPaperPlane />
                    Envoyer le message
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="px-8 py-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Messagerie;