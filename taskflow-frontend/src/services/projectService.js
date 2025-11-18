import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const projectService = {
    createProject: (projectData) => apiService.post(API_ENDPOINTS.PROJECTS.BASE, projectData),
    getProjects: () => apiService.get(API_ENDPOINTS.PROJECTS.BASE),
    getProject: (id) => apiService.get(API_ENDPOINTS.PROJECTS.PROJECT_BY_ID(id)),
    updateProject: (id, projectData) => apiService.put(API_ENDPOINTS.PROJECTS.PROJECT_BY_ID(id), projectData),
    deleteProject: (id) => apiService.delete(API_ENDPOINTS.PROJECTS.PROJECT_BY_ID(id)),
};