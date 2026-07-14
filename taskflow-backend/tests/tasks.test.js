const request = require('supertest');
const { app } = require('./setup');
const { getAuthToken, createTestProject, createTestTask } = require('./helpers');

describe('Tasks', () => {
  let project, list, token;

  beforeAll(async () => {
    token = await getAuthToken();
    const projBody = await createTestProject(token);
    project = projBody.data;
    const listsRes = await request(app)
      .get(`/api/task-lists/projects/${project.id}/lists`)
      .set('Authorization', `Bearer ${token}`);
    list = listsRes.body.data[0];
  });

  describe('POST /api/tasks', () => {
    it('should create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ listId: list.id, projectId: project.id, title: 'Tâche de test' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Tâche de test');
    });

    it('should reject missing title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ listId: list.id, projectId: project.id });
      expect(res.status).toBe(400);
    });

    it('should reject missing listId', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ projectId: project.id, title: 'Sans liste' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/tasks/:taskId', () => {
    it('should get task by id', async () => {
      const task = (await createTestTask(token, list.id, project.id)).data;
      const res = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe(task.title);
    });
  });

  describe('PUT /api/tasks/:taskId', () => {
    it('should update task', async () => {
      const task = (await createTestTask(token, list.id, project.id)).data;
      const res = await request(app)
        .put(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Tâche modifiée' });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Tâche modifiée');
    });
  });

  describe('PATCH /api/tasks/:taskId/complete', () => {
    it('should mark task as complete', async () => {
      const task = (await createTestTask(token, list.id, project.id)).data;
      const res = await request(app)
        .patch(`/api/tasks/${task.id}/complete`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.statusId).toBe(3);
    });
  });

  describe('GET /api/tasks/projects/:projectId/tasks', () => {
    it('should list tasks with filters', async () => {
      const res = await request(app)
        .get(`/api/tasks/projects/${project.id}/tasks`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/tasks/calendar', () => {
    it('should return tasks by date range', async () => {
      const res = await request(app)
        .get(`/api/tasks/calendar?startDate=2026-01-01&endDate=2026-12-31`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.tasks).toBeDefined();
      expect(res.body.data.grouped).toBeDefined();
    });

    it('should reject missing dates', async () => {
      const res = await request(app)
        .get('/api/tasks/calendar')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/tasks/:taskId', () => {
    it('should delete task', async () => {
      const task = (await createTestTask(token, list.id, project.id)).data;
      const res = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
