import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const taskService = {
    // Tâches
    createTask: async (taskData) => {
        const response = await apiService.post(API_ENDPOINTS.TASKS.BASE, taskData);
        return response.data?.data || response.data;
    },
    
    getTask: async (taskId) => {
        const response = await apiService.get(API_ENDPOINTS.TASKS.TASK_BY_ID(taskId));
        return response.data?.data || response.data;
    },
    
    updateTask: async (taskId, taskData) => {
        const response = await apiService.put(API_ENDPOINTS.TASKS.TASK_BY_ID(taskId), taskData);
        return response.data?.data || response.data;
    },
    
    deleteTask: async (taskId) => {
        const response = await apiService.delete(API_ENDPOINTS.TASKS.TASK_BY_ID(taskId));
        return response.data?.data || response.data;
    },
    
    completeTask: async (taskId) => {
        const response = await apiService.patch(API_ENDPOINTS.TASKS.COMPLETE_TASK(taskId));
        return response.data?.data || response.data;
    },
    
    getProjectTasks: async (projectId) => {
        const response = await apiService.get(API_ENDPOINTS.TASKS.PROJECT_TASKS(projectId));
        return response.data?.data || response.data;
    },

    // Listes de tâches
    getProjectLists: async (projectId) => {
        const response = await apiService.get(API_ENDPOINTS.TASK_LISTS.PROJECT_LISTS(projectId));
        return response.data?.data || response.data;
    },
    createList: async (projectId, listData) => {
        const response = await apiService.post(API_ENDPOINTS.TASK_LISTS.CREATE_LIST(projectId), listData);
        return response.data?.data || response.data;
    },
    updateList: async (listId, listData) => {
        const response = await apiService.put(API_ENDPOINTS.TASK_LISTS.UPDATE_LIST(listId), listData);
        return response.data?.data || response.data;
    },
    deleteList: async (listId) => {
        const response = await apiService.delete(API_ENDPOINTS.TASK_LISTS.DELETE_LIST(listId));
        return response.data?.data || response.data;
    },
    moveTask: async (taskId, moveData) => {
        const response = await apiService.patch(API_ENDPOINTS.TASK_LISTS.MOVE_TASK(taskId), moveData);
        return response.data?.data || response.data;
    },
    reorderTasks: async (listId, orderData) => {
        const response = await apiService.patch(API_ENDPOINTS.TASK_LISTS.REORDER_TASKS(listId), orderData);
        return response.data?.data || response.data;
    },
};