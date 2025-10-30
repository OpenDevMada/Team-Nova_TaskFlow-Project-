import { apiClient } from "./api/apiClient";
import { API_ENDPOINTS } from '@/utils/constant';

export const authService = {
    async login(credentials) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

            // Vérifier la structure de la réponse
            if (!response.data.success || !response.data.data) {
                throw new Error('Réponse du serveur invalide');
            }

            const { accessToken, user } = response.data.data;

            if (!accessToken || !user) {
                throw new Error('Données manquantes dans la réponse');
            }

            // Stocker seulement l'access token (le refresh token est dans le cookie HTTP Only)
            localStorage.setItem('taskflow_access_token', accessToken);
            localStorage.setItem('taskflow_user', JSON.stringify(user));

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Connexion réussie',
            };
        } catch (error) {
            let errorMessage = 'Erreur lors de la connexion';

            if (error.response?.status === 401) {
                errorMessage = 'Email ou mot de passe incorrect';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data.message || 'Données invalides';
            } else if (error.response?.status === 404) {
                errorMessage = 'Service non disponible';
            } else if (error.response?.status >= 500) {
                errorMessage = 'Erreur serveur, veuillez réessayer';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    async register(userInfo) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userInfo);

            if (!response.data.success || !response.data.data) {
                throw new Error('Réponse du serveur invalide');
            }

            const { accessToken, user } = response.data.data;

            // Stocker les informations après l'inscription
            localStorage.setItem('taskflow_access_token', accessToken);
            localStorage.setItem('taskflow_user', JSON.stringify(user));

            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Inscription réussie',
            };
        } catch (error) {
            let errorMessage = 'Erreur lors de l\'inscription';

            if (error.response?.status === 400) {
                errorMessage = error.response.data.message || 'Données invalides';
            } else if (error.response?.status === 409) {
                errorMessage = 'Un utilisateur avec cet email existe déjà';
            } else if (error.response?.status >= 500) {
                errorMessage = 'Erreur serveur, veuillez réessayer';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage,
            };
        }
    },

    async logout() {
        try {
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Nettoyer le localStorage même si la requête échoue
            localStorage.removeItem('taskflow_access_token');
            localStorage.removeItem('taskflow_user');
        }
    },

    async refreshToken() {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

            if (response.data.success && response.data.data) {
                // Mettre à jour l'access token
                localStorage.setItem('taskflow_access_token', response.data.data.accessToken);
                if (response.data.data.user) {
                    localStorage.setItem('taskflow_user', JSON.stringify(response.data.data.user));
                }
                return response.data;
            }
            throw new Error('Échec du rafraîchissement du token');
        } catch (error) {
            // En cas d'erreur, déconnecter l'utilisateur
            localStorage.removeItem('taskflow_access_token');
            localStorage.removeItem('taskflow_user');
            throw error;
        }
    },

    async getProfile() {
        try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
            return response.data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    async updateProfile(userData) {
        try {
            const response = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, userData);

            // Mettre à jour les informations utilisateur dans le localStorage
            if (response.data.success && response.data.data) {
                localStorage.setItem('taskflow_user', JSON.stringify(response.data.data));
            }

            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    async changePassword(passwordData) {
        try {
            const response = await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
            return response.data;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    async forgotPassword(email) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    },

    async resetPassword(resetData) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    }
};