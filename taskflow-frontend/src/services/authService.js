import { apiService } from './api';
import { AUTH_ENDPOINTS } from '../utils/constants';

export const authService = {
  register: (userData) => apiService.post(AUTH_ENDPOINTS.REGISTER, userData),
  login: (credentials) => apiService.post(AUTH_ENDPOINTS.LOGIN, credentials),
  forgotPassword: (email) => apiService.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email }),
  resetPassword: (token, newPassword) => apiService.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword }),
  refreshToken: () => apiService.post(AUTH_ENDPOINTS.REFRESH_TOKEN),
  getProfile: () => apiService.get(AUTH_ENDPOINTS.PROFILE),
  updateProfile: (profileData) => apiService.put(AUTH_ENDPOINTS.PROFILE, profileData),
  changePassword: (passwordData) => apiService.put(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData),
  logout: () => apiService.post(AUTH_ENDPOINTS.LOGOUT),
  logoutAll: () => apiService.post(AUTH_ENDPOINTS.LOGOUT_ALL),
};