export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
    ADMIN: 'admin',
    MEMBER: 'member',
    VIEWER: 'viewer'
};

export const PERMISSIONS = {
    ALL: "all",
    MANAGE_CLIENTS: "manage_clients",
    MANAGE_PAYROLL: "manage_payroll",
    MANAGE_EMPLOYEES: "manage_employees",
    VIEW_REPORTS: "view_reports",
}

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    DASHBOARD: "/dashboard",
    PROJECTS: "/projects",
    TASKS: "/tasks",
    UNAUTHORIZED: "/unauthorized",
    NOT_FOUND: "/404",
}

export const API_ENDPOINTS = {

    // Endpoints d'authentification
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        FORGOT_PASSWORD: '/auth/forgot-password',
        REFRESH_TOKEN: '/auth/refresh-token',
        RESET_PASSWORD: '/auth/reset-password',
        PROFILE: '/auth/profile',
        LOGOUT: '/auth/logout',
        LOGOUT_ALL: '/auth/logout-all',
        CHANGE_PASSWORD: '/auth/change-password'
    },

    // Endpoints des projets
    PROJECTS: {
        BASE: '/projects',
        PROJECT_BY_ID: (id) => `/projects/${id}`,
    },

    // Endpoints des membres de projet
    PROJECT_MEMBER: {
        BASE: '/project-members',
        MEMBER_BY_ID: (id) => `/project-members/${id}`,
        PROJECT_MEMBERS: (projectId) => `/project-members/projects/${projectId}/members`,
        ADD_MEMBER: (projectId) => `/project-members/projects/${projectId}/members`,
        UPDATE_ROLE: (id) => `/project-members/${id}/role`,
        REMOVE_MEMBER: (id) => `/project-members/${id}`,
    },

    // Endpoints des tâches
    TASKS: {
        BASE: '/tasks',
        TASK_BY_ID: (taskId) => `/tasks/${taskId}`,
        COMPLETE_TASK: (taskId) => `/tasks/${taskId}/complete`,
        PROJECT_TASKS: (projectId) => `/tasks/projects/${projectId}/tasks`,
    },

    // Endpoints des listes de tâches
    TASK_LISTS: {
        PROJECT_LISTS: (projectId) => `/task-lists/projects/${projectId}/lists`,
        CREATE_LIST: (projectId) => `/task-lists/projects/${projectId}/lists`,
        UPDATE_LIST: (listId) => `/task-lists/lists/${listId}`,
        DELETE_LIST: (listId) => `/task-lists/lists/${listId}`,
        MOVE_TASK: (taskId) => `/task-lists/tasks/${taskId}/move`,
        REORDER_TASKS: (listId) => `/task-lists/lists/${listId}/reorder`,
    },

    USERS: {
        BASE: '/users',
        SEARCH: '/users/search',
    },
}



export const NAVIGATION_ITEMS = {
    [ROLES.ADMIN]: [
        { name: "Dashboard", path: "/admin" },
        { name: "Gestionnaires", path: "/admin/managers" },
    ],
    [ROLES.MEMBER]: [
        { name: "Dashboard", path: "/membre" },
        { name: "Listes", path: "/membre/listes" },
    ],
    [ROLES.VIEWER]: [
        { name: "Dashboard", path: "/admin" },
        { name: "Gestionnaires", path: "/admin/managers" },
    ],
}