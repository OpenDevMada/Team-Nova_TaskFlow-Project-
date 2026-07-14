import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const taskService = {
    // Tâches
    createTask: (taskData) => apiService.post(API_ENDPOINTS.TASKS.BASE, taskData),
    getTask: (taskId) => apiService.get(API_ENDPOINTS.TASKS.TASK_BY_ID(taskId)),
    updateTask: (taskId, taskData) => apiService.put(API_ENDPOINTS.TASKS.TASK_BY_ID(taskId), taskData),
    deleteTask: (taskId) => apiService.delete(API_ENDPOINTS.TASKS.TASK_BY_ID(taskId)),
    completeTask: (taskId) => apiService.patch(API_ENDPOINTS.TASKS.COMPLETE_TASK(taskId)),
    getProjectTasks: (projectId) => apiService.get(API_ENDPOINTS.TASKS.PROJECT_TASKS(projectId)),

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