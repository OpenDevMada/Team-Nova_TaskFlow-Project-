import { apiService } from './api'

export const dashboardService = {
    getStats: () => apiService.get('/dashboard/stats'),
    getRecentProjects: (limit = 4) => apiService.get('/dashboard/recent-projects', { params: { limit } }),
    getRecentTasks: (limit = 4) => apiService.get('/dashboard/recent-tasks', { params: { limit } }),
}
