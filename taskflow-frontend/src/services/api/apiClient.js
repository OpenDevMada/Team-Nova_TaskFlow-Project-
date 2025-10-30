import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Intercepteur pour ajouter le token d'accès
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('taskflow_access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'authentification et rafraîchir le token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Tenter de rafraîchir le token
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                if (response.data.success) {
                    // Mettre à jour le token d'accès dans localStorage
                    localStorage.setItem('taskflow_access_token', response.data.data.accessToken);

                    // Rejouer la requête originale avec le nouveau token
                    originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Si le refresh échoue, déconnecter l'utilisateur
                console.error('Refresh token failed:', refreshError);
                await logoutUser();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Fonction de déconnexion
const logoutUser = async () => {
    try {
        // Appeler l'endpoint de déconnexion
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Nettoyer le localStorage
        localStorage.removeItem('taskflow_access_token');
        localStorage.removeItem('taskflow_user');

        // Rediriger vers la page de login
        window.location.href = '/login';
    }
};

export { apiClient, logoutUser };