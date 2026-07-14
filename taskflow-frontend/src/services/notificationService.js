import { apiService } from './api'
import { API_ENDPOINTS } from '../utils/constants'

export const notificationService = {
  getNotifications: () => apiService.get(API_ENDPOINTS.NOTIFICATIONS.BASE),

  getUnreadCount: () => apiService.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT),

  markAsRead: (id) => apiService.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),

  markAllAsRead: () => apiService.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),
}
