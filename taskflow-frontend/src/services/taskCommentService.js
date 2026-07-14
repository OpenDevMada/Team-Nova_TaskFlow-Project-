import { apiService } from './api'
import { API_ENDPOINTS } from '../utils/constants'

export const taskCommentService = {
  getComments: (taskId) => apiService.get(API_ENDPOINTS.TASK_COMMENTS.BASE(taskId)),

  createComment: (taskId, content) =>
    apiService.post(API_ENDPOINTS.TASK_COMMENTS.BASE(taskId), { content }),

  updateComment: (taskId, commentId, content) =>
    apiService.put(API_ENDPOINTS.TASK_COMMENTS.COMMENT_BY_ID(taskId, commentId), { content }),

  deleteComment: (taskId, commentId) =>
    apiService.delete(API_ENDPOINTS.TASK_COMMENTS.COMMENT_BY_ID(taskId, commentId)),
}
