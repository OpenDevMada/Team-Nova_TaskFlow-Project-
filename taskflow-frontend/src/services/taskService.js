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
    getProjectLists: (projectId) => apiService.get(API_ENDPOINTS.TASK_LISTS.PROJECT_LISTS(projectId)),
    createList: (projectId, listData) => apiService.post(API_ENDPOINTS.TASK_LISTS.CREATE_LIST(projectId), listData),
    updateList: (listId, listData) => apiService.put(API_ENDPOINTS.TASK_LISTS.UPDATE_LIST(listId), listData),
    deleteList: (listId) => apiService.delete(API_ENDPOINTS.TASK_LISTS.DELETE_LIST(listId)),
    moveTask: (taskId, moveData) => apiService.patch(API_ENDPOINTS.TASK_LISTS.MOVE_TASK(taskId), moveData),
    reorderTasks: (listId, orderData) => apiService.patch(API_ENDPOINTS.TASK_LISTS.REORDER_TASKS(listId), orderData),
};