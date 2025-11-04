export const API_BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api';

export const ROLES = {
    ADMIN: 'admin',
    MEMBER: 'member',
    VIEWER: 'viewer'
};

export const ROUTES = {
    HOME: "/",
    LOGIN: "/auth/login",
    PROFILE: "/auth/profile",
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ADMIN: "/admin",
    CABINET: "/cabinet",
    CLIENT: "/client",
    UNAUTHORIZED: "/unauthorized",
    NOT_FOUND: "/404",
}

// Endpoints d'authentification
export const AUTH_ENDPOINTS = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    CHANGE_PASSWORD: '/auth/change-password'
};

// Endpoints des projets
export const PROJECT_ENDPOINTS = {
    PROJECTS: '/projects',
    PROJECT_BY_ID: (id) => `/projects/${id}`,
};

// Endpoints des membres de projet
export const PROJECT_MEMBER_ENDPOINTS = {
    MEMBERS: '/project-members',
    MEMBER_BY_ID: (id) => `/project-members/${id}`,
};

// Endpoints des tâches
export const TASK_ENDPOINTS = {
    TASKS: '/tasks',
    TASK_BY_ID: (taskId) => `/tasks/${taskId}`,
    COMPLETE_TASK: (taskId) => `/tasks/${taskId}/complete`,
    PROJECT_TASKS: (projectId) => `/tasks/projects/${projectId}/tasks`,
};

// Endpoints des listes de tâches
export const TASK_LIST_ENDPOINTS = {
    PROJECT_LISTS: (projectId) => `/task-lists/projects/${projectId}/lists`,
    CREATE_LIST: (projectId) => `/task-lists/projects/${projectId}/lists`,
    UPDATE_LIST: (listId) => `/task-lists/lists/${listId}`,
    DELETE_LIST: (listId) => `/task-lists/lists/${listId}`,
    MOVE_TASK: (taskId) => `/task-lists/tasks/${taskId}/move`,
    REORDER_TASKS: (listId) => `/task-lists/lists/${listId}/reorder`,
};

export const NAVIGATION_ITEMS = {
    [ROLES.ADMIN]: [
        { name: "Dashboard", path: "/admin" },
        { name: "Gestionnaires", path: "/admin/managers" },
    ],
}