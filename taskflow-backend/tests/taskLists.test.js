const request = require('supertest');
const { app } = require('./setup');
const { getAuthToken, createTestProject, createTestTaskList } = require('./helpers');

describe('TaskLists — GET /api/task-lists/projects/:projectId/lists', () => {
  it('should return default lists after project creation', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const res = await request(app)
      .get(`/api/task-lists/projects/${project.id}/lists`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(5);
  });
});

describe('TaskLists — POST /api/task-lists/projects/:projectId/lists', () => {
  it('should create a new list', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const res = await request(app)
      .post(`/api/task-lists/projects/${project.id}/lists`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ma nouvelle liste' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Ma nouvelle liste');
  });

  it('should reject missing name', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const res = await request(app)
      .post(`/api/task-lists/projects/${project.id}/lists`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('TaskLists — PUT /api/task-lists/lists/:listId', () => {
  it('should update list name', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const list = (await createTestTaskList(token, project.id)).data || (await request(app)
      .get(`/api/task-lists/projects/${project.id}/lists`)
      .set('Authorization', `Bearer ${token}`)).body.data[0];

    const res = await request(app)
      .put(`/api/task-lists/lists/${list.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Liste renommée' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Liste renommée');
  });
});

describe('TaskLists — DELETE /api/task-lists/lists/:listId', () => {
  it('should delete empty list', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const listsRes = await request(app)
      .get(`/api/task-lists/projects/${project.id}/lists`)
      .set('Authorization', `Bearer ${token}`);
    const listToDelete = listsRes.body.data[listsRes.body.data.length - 1];

    const res = await request(app)
      .delete(`/api/task-lists/lists/${listToDelete.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
