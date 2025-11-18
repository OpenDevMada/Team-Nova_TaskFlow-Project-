import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants'

// Création d’une instance axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {

        const originalRequest = error.config;

        // Gestion du refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Rafraîchir le token
                const refreshResponse = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
                const newAccessToken = refreshResponse.data.data.accessToken;

                localStorage.setItem('authToken', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Pour les autres erreurs
        console.error('API error:', error);
        throw error;
    }
);


// Service générique
export const apiService = {
    get: (endpoint, config = {}) => api.get(endpoint, config),
    post: (endpoint, data, config = {}) => api.post(endpoint, data, config),
    put: (endpoint, data, config = {}) => api.put(endpoint, data, config),
    patch: (endpoint, data, config = {}) => api.patch(endpoint, data, config),
    delete: (endpoint, config = {}) => api.delete(endpoint, config),
}
