const apiDocs = {
  baseUrl: 'http://localhost:5000',
  endpoints: {
    auth: {
      register: {
        method: 'POST',
        url: '/api/users/register',
        body: {
          email: 'string (required)',
          password: 'string (min: 6)',
          firstName: 'string (required)',
          lastName: 'string (required)'
        }
      },
      login: {
        method: 'POST', 
        url: '/api/users/login',
        body: {
          email: 'string',
          password: 'string'
        }
      }
    },
    tasks: {
      list: {
        method: 'GET',
        url: '/api/tasks',
        query: {
          status: 'pending|in_progress|completed (optional)',
          priority: 'low|medium|high (optional)'
        }
      },
      create: {
        method: 'POST',
        url: '/api/tasks', 
        body: {
          title: 'string (required)',
          description: 'string (optional)',
          status: 'pending|in_progress|completed',
          priority: 'low|medium|high'
        }
      }
    }
  }
};

module.exports = apiDocs;