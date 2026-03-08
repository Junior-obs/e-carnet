import api, { post } from './api';

// Service d'authentification
class AuthService {
  // Connexion
  async login(email, password) {
    try {
      const response = await post('/auth/login', { email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userRole', response.user.role);
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Inscription
  async register(userData) {
    try {
      const response = await post('/auth/register', userData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Récupérer l'utilisateur courant
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Récupérer le rôle
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  // Rafraîchir le token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await post('/auth/refresh', { refreshToken });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Changer le mot de passe
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Demander la réinitialisation du mot de passe
  async forgotPassword(email) {
    try {
      const response = await post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Réinitialiser le mot de passe
  async resetPassword(token, newPassword) {
    try {
      const response = await post('/auth/reset-password', {
        token,
        newPassword
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Vérifier l'email
  async verifyEmail(token) {
    try {
      const response = await post('/auth/verify-email', { token });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Gestion des erreurs
  handleError(error) {
    if (error.response) {
      // Erreur du serveur
      const message = error.response.data.message || 'Une erreur est survenue';
      return new Error(message);
    } else if (error.request) {
      // Pas de réponse
      return new Error('Impossible de contacter le serveur');
    } else {
      // Autre erreur
      return error;
    }
  }
}

export default new AuthService();