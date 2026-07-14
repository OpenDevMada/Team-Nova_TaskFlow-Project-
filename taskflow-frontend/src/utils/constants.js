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

    NOTIFICATIONS: {
        BASE: '/notifications',
        UNREAD_COUNT: '/notifications/unread-count',
        MARK_READ: (id) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/mark-all-read',
    },

    TASK_COMMENTS: {
        BASE: (taskId) => `/tasks/${taskId}/comments`,
        COMMENT_BY_ID: (taskId, commentId) => `/tasks/${taskId}/comments/${commentId}`,
    },

    UPLOAD: {
        AVATAR: '/upload/avatar',
        TASK_ATTACHMENT: (taskId) => `/upload/tasks/${taskId}/attachments`,
    },

    CALENDAR: '/tasks/calendar',
}



export const STATUS_MAP = {
    1: 'todo',
    2: 'in-progress',
    3: 'done',
}

export const getTaskStatus = (task) => {
    if (task?.statusId && STATUS_MAP[task.statusId]) {
        return STATUS_MAP[task.statusId]
    }

    const statusName = task?.status?.name
    if (statusName === 'done' || statusName === 'completed') return 'done'
    if (statusName === 'in_progress' || statusName === 'in-progress') return 'in-progress'
    if (statusName === 'todo' || statusName === 'to_do') return 'todo'

    return 'todo'
}

export const isTaskDone = (task) => task?.statusId === 3 || task?.status?.name === 'done' || task?.status === 'completed'

export const calculateProjectProgress = (project) => {
    const tasks = project?.tasks || project?.taskLists?.flatMap((list) => list.tasks || []) || []
    if (tasks.length === 0) return 0

    const completedTasks = tasks.filter((task) => isTaskDone(task)).length
    return Math.round((completedTasks / tasks.length) * 100)
}

export const getProjectStatus = (project) => {
    if (project?.isArchived) return 'completed'
    if (project?.status === 'planning') return 'planning'
    if (project?.status === 'completed') return 'completed'
    return 'active'
}

export const formatDate = (dateString, options = {}) => {
    if (!dateString) return "Date inconnue"

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return "Date inconnue"

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
    })
}

export const formatShortDate = (dateString) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return ""

    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
    })
}

export const getDisplayName = (user, fallback = "Non assigné") => {
    if (!user) return fallback
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim()
    return name || fallback
}

export const getDisplayInitials = (user, fallback = "U") => {
    if (!user) return fallback
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || fallback
}

export const mapProjectToCard = (project) => ({
    id: project.id,
    title: project.name,
    description: project.description,
    progress: calculateProjectProgress(project),
    members: project.members?.length || 0,
    status: getProjectStatus(project),
    color: project.color || "#33C1FF",
    createdAt: project.created_at,
})

export const mapTaskToCard = (task) => ({
    id: task.id,
    title: task.title,
    priority: task.priority?.name || 'medium',
    dueDate: formatShortDate(task.dueDate),
    assignee: {
        name: getDisplayName(task.assignee),
        avatar: task.assignee?.avatarUrl || "/placeholder.svg",
    },
    comments: task.comments?.length || 0,
    project: task.project?.name || '',
    status: getTaskStatus(task),
})

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