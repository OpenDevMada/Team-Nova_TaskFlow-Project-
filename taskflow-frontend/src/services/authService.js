import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';


// Helper pour gérer la structure de réponse
const getResponseData = (response) => {
  return response.data.data || response.data;
};

export const authService = {
  register: async (userData) => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    const data = getResponseData(response);

    return {
      user: data.user,
      accessToken: data.accessToken,
    };
  },

  login: async (credentials) => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    console.log('Login response structure:', response);
    const data = getResponseData(response);

    return {
      user: data.user,
      accessToken: data.accessToken
    };
  },

  forgotPassword: async (email) => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return getResponseData(response);
  },

  resetPassword: async (token, newPassword) => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
    return getResponseData(response);
  },

  refreshToken: async () => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    console.log('Refresh token response:', response); // Debug
    const data = getResponseData(response);

    return {
      user: data.user,
      accessToken: data.accessToken,
    };
  },

  getProfile: async () => {
    const response = await apiService.get(API_ENDPOINTS.AUTH.PROFILE);
    return getResponseData(response);
  },

  updateProfile: async (profileData) => {
    const response = await apiService.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
    return getResponseData(response);
  },

  changePassword: async (passwordData) => {
    const response = await apiService.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    return getResponseData(response);
  },

  logout: async () => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    return getResponseData(response);
  },

  logoutAll: async () => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);
    return getResponseData(response);
  },
};