import api, { get, post, put, del } from './api';

// Service pour les patients
class PatientService {
  // Récupérer le profil du patient
  async getProfile() {
    try {
      const response = await get('/patient/profile');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mettre à jour le profil
  async updateProfile(profileData) {
    try {
      const response = await put('/patient/profile', profileData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer le dossier médical complet
  async getDossierMedical() {
    try {
      const response = await get('/patient/dossier-medical');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les consultations
  async getConsultations() {
    try {
      const response = await get('/patient/consultations');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les vaccins
  async getVaccins() {
    try {
      const response = await get('/patient/vaccins');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Ajouter un vaccin
  async addVaccin(vaccinData) {
    try {
      const response = await post('/patient/vaccins', vaccinData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les allergies
  async getAllergies() {
    try {
      const response = await get('/patient/allergies');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Ajouter une allergie
  async addAllergie(allergieData) {
    try {
      const response = await post('/patient/allergies', allergieData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les traitements
  async getTraitements() {
    try {
      const response = await get('/patient/traitements');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les analyses
  async getAnalyses() {
    try {
      const response = await get('/patient/analyses');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Télécharger un document
  async uploadDocument(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await api.post('/patient/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les constantes
  async getConstantes() {
    try {
      const response = await get('/patient/constantes');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Ajouter des constantes
  async addConstantes(constantesData) {
    try {
      const response = await post('/patient/constantes', constantesData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les rendez-vous
  async getRendezVous() {
    try {
      const response = await get('/patient/rendez-vous');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Prendre un rendez-vous
  async prendreRendezVous(rdvData) {
    try {
      const response = await post('/patient/rendez-vous', rdvData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Annuler un rendez-vous
  async annulerRendezVous(rdvId) {
    try {
      const response = await del(`/patient/rendez-vous/${rdvId}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Récupérer les messages
  async getMessages() {
    try {
      const response = await get('/patient/messages');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Envoyer un message
  async envoyerMessage(messageData) {
    try {
      const response = await post('/patient/messages', messageData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Marquer un message comme lu
  async marquerCommeLu(messageId) {
    try {
      const response = await put(`/patient/messages/${messageId}/lu`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Donner son consentement
  async donnerConsentement(professionnelId, typeAcces) {
    try {
      const response = await post('/patient/consentements', {
        professionnelId,
        typeAcces
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Gestion des erreurs
  handleError(error) {
    if (error.response) {
      const message = error.response.data.message || 'Erreur lors de l\'opération';
      return new Error(message);
    }
    return error;
  }
}

export default new PatientService();