import { apiService } from './api';
import { PROJECT_ENDPOINTS } from '../utils/constants';

export const projectService = {
    createProject: (projectData) => apiService.post(PROJECT_ENDPOINTS.PROJECTS, projectData),
    getProjects: () => apiService.get(PROJECT_ENDPOINTS.PROJECTS),
    getProject: (id) => apiService.get(PROJECT_ENDPOINTS.PROJECT_BY_ID(id)),
    updateProject: (id, projectData) => apiService.put(PROJECT_ENDPOINTS.PROJECT_BY_ID(id), projectData),
    deleteProject: (id) => apiService.delete(PROJECT_ENDPOINTS.PROJECT_BY_ID(id)),
};