const apiDocs = {
  baseUrl: 'http://localhost:5000',
  description: 'Documentation API TaskFlow — Tous les endpoints nécessitent un token JWT (sauf register/login/forgot-password)',
  endpoints: {
    auth: {
      register: {
        method: 'POST',
        url: '/api/auth/register',
        auth: false,
        body: {
          email: 'string (required)',
          password: 'string (min: 6, must have uppercase + lowercase + digit)',
          firstName: 'string (required)',
          lastName: 'string (required)'
        }
      },
      login: {
        method: 'POST',
        url: '/api/auth/login',
        auth: false,
        body: {
          email: 'string (required)',
          password: 'string (required)'
        }
      },
      forgotPassword: {
        method: 'POST',
        url: '/api/auth/forgot-password',
        auth: false,
        body: { email: 'string (required)' }
      },
      resetPassword: {
        method: 'POST',
        url: '/api/auth/reset-password',
        auth: false,
        body: { token: 'string (required)', newPassword: 'string (required)' }
      },
      refreshToken: {
        method: 'POST',
        url: '/api/auth/refresh-token',
        auth: false,
        body: { refreshToken: 'string (optional — peut être dans un cookie)' }
      },
      getProfile: { method: 'GET', url: '/api/auth/profile', auth: true },
      updateProfile: { method: 'PUT', url: '/api/auth/profile', auth: true, body: { firstName: 'string', lastName: 'string', avatarUrl: 'string (URL)' } },
      changePassword: { method: 'PUT', url: '/api/auth/change-password', auth: true, body: { currentPassword: 'string', newPassword: 'string' } },
      logout: { method: 'POST', url: '/api/auth/logout', auth: true },
      logoutAll: { method: 'POST', url: '/api/auth/logout-all', auth: true }
    },
    users: {
      search: { method: 'GET', url: '/api/users/search?q=...', auth: true },
      listAll: { method: 'GET', url: '/api/users', auth: true }
    },
    projects: {
      list: { method: 'GET', url: '/api/projects', auth: true },
      create: { method: 'POST', url: '/api/projects', auth: true, body: { name: 'string (required)', description: 'string', color: 'string (#RRGGBB)' } },
      getById: { method: 'GET', url: '/api/projects/:id', auth: true },
      update: { method: 'PUT', url: '/api/projects/:id', auth: true },
      delete: { method: 'DELETE', url: '/api/projects/:id', auth: true }
    },
    projectMembers: {
      listByProject: { method: 'GET', url: '/api/project-members/projects/:projectId/members', auth: true },
      addMember: { method: 'POST', url: '/api/project-members/projects/:projectId/members', auth: true, body: { userId: 'UUID', role: 'admin|member|viewer' } },
      updateRole: { method: 'PATCH', url: '/api/project-members/:id/role', auth: true, body: { role: 'admin|member|viewer' } },
      listAll: { method: 'GET', url: '/api/project-members', auth: true },
      getById: { method: 'GET', url: '/api/project-members/:id', auth: true },
      remove: { method: 'DELETE', url: '/api/project-members/:id', auth: true }
    },
    taskLists: {
      getProjectLists: { method: 'GET', url: '/api/task-lists/projects/:projectId/lists', auth: true },
      createList: { method: 'POST', url: '/api/task-lists/projects/:projectId/lists', auth: true, body: { name: 'string (required)' } },
      updateList: { method: 'PUT', url: '/api/task-lists/lists/:listId', auth: true },
      deleteList: { method: 'DELETE', url: '/api/task-lists/lists/:listId', auth: true },
      moveTask: { method: 'PATCH', url: '/api/task-lists/tasks/:taskId/move', auth: true },
      reorderTasks: { method: 'PATCH', url: '/api/task-lists/lists/:listId/reorder', auth: true }
    },
    tasks: {
      create: { method: 'POST', url: '/api/tasks', auth: true, body: { title: 'string (required)', listId: 'UUID', projectId: 'UUID', description: 'string', priorityId: '1|2|3', assigneeId: 'UUID', dueDate: 'ISO date' } },
      getById: { method: 'GET', url: '/api/tasks/:taskId', auth: true },
      update: { method: 'PUT', url: '/api/tasks/:taskId', auth: true },
      delete: { method: 'DELETE', url: '/api/tasks/:taskId', auth: true },
      complete: { method: 'PATCH', url: '/api/tasks/:taskId/complete', auth: true },
      getByProject: { method: 'GET', url: '/api/tasks/projects/:projectId/tasks?status=&priority=&assignee=', auth: true },
      calendar: { method: 'GET', url: '/api/tasks/calendar?startDate=2026-01-01&endDate=2026-01-31', auth: true, description: 'Tâches filtrées par plage de dates, groupées par jour' }
    },
    taskComments: {
      list: { method: 'GET', url: '/api/tasks/:taskId/comments', auth: true },
      create: { method: 'POST', url: '/api/tasks/:taskId/comments', auth: true, body: { content: 'text (required)' } },
      update: { method: 'PUT', url: '/api/tasks/:taskId/comments/:commentId', auth: true },
      delete: { method: 'DELETE', url: '/api/tasks/:taskId/comments/:commentId', auth: true }
    },
    notifications: {
      list: { method: 'GET', url: '/api/notifications', auth: true },
      unreadCount: { method: 'GET', url: '/api/notifications/unread-count', auth: true },
      markRead: { method: 'PATCH', url: '/api/notifications/:notificationId/read', auth: true },
      markAllRead: { method: 'POST', url: '/api/notifications/mark-all-read', auth: true }
    },
    dashboard: {
      stats: { method: 'GET', url: '/api/dashboard/stats', auth: true },
      recentProjects: { method: 'GET', url: '/api/dashboard/recent-projects?limit=5', auth: true },
      recentTasks: { method: 'GET', url: '/api/dashboard/recent-tasks?limit=5', auth: true }
    },
    upload: {
      avatar: { method: 'POST', url: '/api/upload/avatar', auth: true, body: { avatar: 'file (image, max 10MB)' } },
      taskAttachment: { method: 'POST', url: '/api/upload/tasks/:taskId/attachments', auth: true, body: { file: 'file (max 10MB)' } }
    }
  }
};

module.exports = apiDocs;
