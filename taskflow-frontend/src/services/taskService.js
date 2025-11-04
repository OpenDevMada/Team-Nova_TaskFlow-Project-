import { apiService } from './api';
import { TASK_ENDPOINTS, TASK_LIST_ENDPOINTS } from '../utils/constants';

export const taskService = {
    // Tâches
    createTask: (taskData) => apiService.post(TASK_ENDPOINTS.TASKS, taskData),
    getTask: (taskId) => apiService.get(TASK_ENDPOINTS.TASK_BY_ID(taskId)),
    updateTask: (taskId, taskData) => apiService.put(TASK_ENDPOINTS.TASK_BY_ID(taskId), taskData),
    deleteTask: (taskId) => apiService.delete(TASK_ENDPOINTS.TASK_BY_ID(taskId)),
    completeTask: (taskId) => apiService.patch(TASK_ENDPOINTS.COMPLETE_TASK(taskId)),
    getProjectTasks: (projectId) => apiService.get(TASK_ENDPOINTS.PROJECT_TASKS(projectId)),

    // Listes de tâches
    getProjectLists: (projectId) => apiService.get(TASK_LIST_ENDPOINTS.PROJECT_LISTS(projectId)),
    createList: (projectId, listData) => apiService.post(TASK_LIST_ENDPOINTS.CREATE_LIST(projectId), listData),
    updateList: (listId, listData) => apiService.put(TASK_LIST_ENDPOINTS.UPDATE_LIST(listId), listData),
    deleteList: (listId) => apiService.delete(TASK_LIST_ENDPOINTS.DELETE_LIST(listId)),
    moveTask: (taskId, moveData) => apiService.patch(TASK_LIST_ENDPOINTS.MOVE_TASK(taskId), moveData),
    reorderTasks: (listId, orderData) => apiService.patch(TASK_LIST_ENDPOINTS.REORDER_TASKS(listId), orderData),
};