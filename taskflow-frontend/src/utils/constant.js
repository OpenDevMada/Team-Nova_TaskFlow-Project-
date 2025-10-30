export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    RESET_PASSWORD: '/reset-password',
    FORGOT_PASSWORD: '/forgot-password',
    TASKS: '/tasks',
    
    UNAUTHORIZED: "/unauthorized",
    NOT_FOUND: "/404",
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        LOGOUT_ALL: '/auth/logout-all',
        REFRESH_TOKEN: '/auth/refresh-token',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        PROFILE: '/auth/profile',
        CHANGE_PASSWORD: '/auth/change-password',
    },
    TASKS: {
        GET: '/tasks',
        CREATE: '/tasks/create',
        UPDATE: '/tasks/update',
        DELETE: '/tasks/delete',
    },
};