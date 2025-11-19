import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const userService = {
    // Rechercher des utilisateurs
    searchUsers: async (query = '') => {
        const response = await apiService.get(`${API_ENDPOINTS.USERS.SEARCH}?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Récupérer tous les utilisateurs
    getAllUsers: async () => {
        const response = await apiService.get(API_ENDPOINTS.USERS.BASE);
        return response.data;
    }
};