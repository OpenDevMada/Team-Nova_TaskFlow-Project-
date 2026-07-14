const request = require('supertest');
const { app } = require('../src/app');

const TEST_ADMIN = {
  email: 'admin-test@taskflow.com',
  password: 'Admin123',
  firstName: 'Admin',
  lastName: 'Test',
  roleGlobal: 'admin'
};

const TEST_MEMBER = {
  email: 'member-test@taskflow.com',
  password: 'Member123',
  firstName: 'Membre',
  lastName: 'Test'
};

async function registerUser(userData = TEST_ADMIN) {
  const res = await request(app)
    .post('/api/auth/register')
    .send(userData);
  return res.body;
}

async function loginUser(email = TEST_ADMIN.email, password = TEST_ADMIN.password) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return { status: res.status, body: res.body };
}

async function getAuthToken(email = TEST_ADMIN.email, password = TEST_ADMIN.password) {
  await registerUser({ email, password, firstName: 'Test', lastName: 'User', roleGlobal: 'admin' });
  const result = await loginUser(email, password);
  return result.body.data?.accessToken || result.body.accessToken;
}

async function createTestProject(token, data = {}) {
  const res = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: data.name || 'Projet de test',
      description: data.description || 'Description du projet de test',
      color: data.color || '#3B82F6'
    });
  return res.body;
}

async function createTestTaskList(token, projectId, data = {}) {
  const res = await request(app)
    .post(`/api/task-lists/projects/${projectId}/lists`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: data.name || 'Liste de test' });
  return res.body;
}

async function createTestTask(token, listId, projectId, data = {}) {
  const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({
      listId,
      projectId,
      title: data.title || 'Tâche de test',
      description: data.description || 'Description de la tâche'
    });
  return res.body;
}

module.exports = {
  TEST_ADMIN,
  TEST_MEMBER,
  registerUser,
  loginUser,
  getAuthToken,
  createTestProject,
  createTestTaskList,
  createTestTask,
  app
};
