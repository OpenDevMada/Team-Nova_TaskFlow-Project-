const request = require('supertest');
const { app } = require('./setup');
const { getAuthToken, createTestProject, createTestTask } = require('./helpers');

describe('Comments', () => {
  let project, list, task, token;

  beforeAll(async () => {
    token = await getAuthToken();
    const projBody = await createTestProject(token);
    project = projBody.data;
    const listsRes = await request(app)
      .get(`/api/task-lists/projects/${project.id}/lists`)
      .set('Authorization', `Bearer ${token}`);
    list = listsRes.body.data[0];
    task = (await createTestTask(token, list.id, project.id)).data;
  });

  describe('POST /api/tasks/:taskId/comments', () => {
    it('should add a comment', async () => {
      const res = await request(app)
        .post(`/api/tasks/${task.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Ceci est un commentaire de test' });
      expect(res.status).toBe(201);
      expect(res.body.data.content).toBe('Ceci est un commentaire de test');
    });

    it('should reject empty comment', async () => {
      const res = await request(app)
        .post(`/api/tasks/${task.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/tasks/:taskId/comments', () => {
    it('should list comments', async () => {
      const res = await request(app)
        .get(`/api/tasks/${task.id}/comments`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('PUT /api/tasks/:taskId/comments/:commentId', () => {
    it('should update a comment', async () => {
      const commentRes = await request(app)
        .post(`/api/tasks/${task.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'À modifier' });
      const commentId = commentRes.body.data.id;

      const res = await request(app)
        .put(`/api/tasks/${task.id}/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Commentaire modifié' });
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /api/tasks/:taskId/comments/:commentId', () => {
    it('should delete a comment', async () => {
      const commentRes = await request(app)
        .post(`/api/tasks/${task.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'À supprimer' });
      const commentId = commentRes.body.data.id;

      const res = await request(app)
        .delete(`/api/tasks/${task.id}/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
});
