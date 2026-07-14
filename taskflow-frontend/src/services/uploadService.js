import { apiService } from './api'
import { API_ENDPOINTS } from '../utils/constants'

export const uploadService = {
  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return apiService.post(API_ENDPOINTS.UPLOAD.AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  uploadTaskAttachment: (taskId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiService.post(API_ENDPOINTS.UPLOAD.TASK_ATTACHMENT(taskId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
