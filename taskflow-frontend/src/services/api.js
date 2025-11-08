import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

// Création d’une instance axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API error:', error)
        throw error
    }
)

// Service générique
export const apiService = {
    get: (endpoint, config = {}) => api.get(endpoint, config),
    post: (endpoint, data, config = {}) => api.post(endpoint, data, config),
    put: (endpoint, data, config = {}) => api.put(endpoint, data, config),
    patch: (endpoint, data, config = {}) => api.patch(endpoint, data, config),
    delete: (endpoint, config = {}) => api.delete(endpoint, config),
}
