import { apiService } from './api';
import { AUTH_ENDPOINTS } from '../utils/constants';


// Helper pour gérer la structure de réponse
const getResponseData = (response) => {
  return response.data.data || response.data;
};

export const authService = {
  register: async (userData) => {
    const response = await apiService.post(AUTH_ENDPOINTS.REGISTER, userData);
    const data = getResponseData(response);

    return {
      user: data.user,
      accessToken: data.accessToken,
    };
  },

  login: async (credentials) => {
    const response = await apiService.post(AUTH_ENDPOINTS.LOGIN, credentials);
    console.log('Login response structure:', response);
    const data = getResponseData(response);

    return {
      user: data.user,
      accessToken: data.accessToken
    };
  },

  forgotPassword: async (email) => {
    const response = await apiService.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return getResponseData(response);
  },

  resetPassword: async (token, newPassword) => {
    const response = await apiService.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
    return getResponseData(response);
  },

  refreshToken: async () => {
    const response = await apiService.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
    console.log('Refresh token response:', response); // Debug
    const data = getResponseData(response);

    return {
      user: data.user,
      accessToken: data.accessToken,
    };
  },

  getProfile: async () => {
    const response = await apiService.get(AUTH_ENDPOINTS.PROFILE);
    return getResponseData(response);
  },

  updateProfile: async (profileData) => {
    const response = await apiService.put(AUTH_ENDPOINTS.PROFILE, profileData);
    return getResponseData(response);
  },

  changePassword: async (passwordData) => {
    const response = await apiService.put(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData);
    return getResponseData(response);
  },

  logout: async () => {
    const response = await apiService.post(AUTH_ENDPOINTS.LOGOUT);
    return getResponseData(response);
  },

  logoutAll: async () => {
    const response = await apiService.post(AUTH_ENDPOINTS.LOGOUT_ALL);
    return getResponseData(response);
  },
};