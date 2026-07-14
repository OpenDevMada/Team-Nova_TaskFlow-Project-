const request = require('supertest');
const { app } = require('./setup');
const { TEST_ADMIN, TEST_MEMBER, getAuthToken, createTestProject } = require('./helpers');

describe('Projects — POST /api/projects', () => {
  it('should create a project (admin)', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nouveau projet', description: 'Description', color: '#3B82F6' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Nouveau projet');
  });

  it('should reject non-admin user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(TEST_MEMBER);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_MEMBER.email, password: TEST_MEMBER.password });
    const memberToken = loginRes.body.data.accessToken;
    const res2 = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ name: 'Projet interdit', description: 'Test' });
    expect(res2.status).toBe(403);
  });

  it('should reject missing name', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Sans nom' });
    expect(res.status).toBe(400);
  });
});

describe('Projects — GET /api/projects', () => {
  it('should list projects', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Projects — GET /api/projects/:id', () => {
  it('should get project by id', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const res = await request(app)
      .get(`/api/projects/${project.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe(project.name);
  });

  it('should reject non-member', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    await request(app).post('/api/auth/register').send(TEST_MEMBER);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_MEMBER.email, password: TEST_MEMBER.password });
    const memberToken = loginRes.body.data.accessToken;
    const res = await request(app)
      .get(`/api/projects/${project.id}`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.status).toBe(403);
  });
});

describe('Projects — PUT /api/projects/:id', () => {
  it('should update project', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const res = await request(app)
      .put(`/api/projects/${project.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Projet modifié', color: '#10B981' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Projet modifié');
  });
});

describe('Projects — DELETE /api/projects/:id', () => {
  it('should delete project', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const res = await request(app)
      .delete(`/api/projects/${project.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject non-existent project', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .delete('/api/projects/00000000-0000-0000-0000-000000000099')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
