const request = require('supertest');
const { app } = require('./setup');
const { TEST_ADMIN, TEST_MEMBER, getAuthToken, createTestProject, registerUser } = require('./helpers');

describe('ProjectMembers — POST /api/project-members/projects/:projectId/members', () => {
  it('should add a member to project', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    await registerUser(TEST_MEMBER);
    const memberLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_MEMBER.email, password: TEST_MEMBER.password });

    const res = await request(app)
      .post(`/api/project-members/projects/${project.id}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: memberLogin.body.data.user.id, role: 'member' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should reject missing userId', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const res = await request(app)
      .post(`/api/project-members/projects/${project.id}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'member' });
    expect(res.status).toBe(400);
  });
});

describe('ProjectMembers — GET /api/project-members/projects/:projectId/members', () => {
  it('should list project members', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const res = await request(app)
      .get(`/api/project-members/projects/${project.id}/members`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('ProjectMembers — PATCH /api/project-members/:id/role', () => {
  it('should update member role', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const members = await request(app)
      .get(`/api/project-members/projects/${project.id}/members`)
      .set('Authorization', `Bearer ${token}`)
      .then(r => r.body.data);
    const memberToUpdate = members[0];

    const res = await request(app)
      .patch(`/api/project-members/${memberToUpdate.id}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'viewer' });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('viewer');
  });

  it('should reject invalid role', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const members = await request(app)
      .get(`/api/project-members/projects/${project.id}/members`)
      .set('Authorization', `Bearer ${token}`)
      .then(r => r.body.data);

    const res = await request(app)
      .patch(`/api/project-members/${members[0].id}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'invalid-role' });
    expect(res.status).toBe(400);
  });
});

describe('ProjectMembers — DELETE /api/project-members/:id', () => {
  it('should remove a member', async () => {
    const token = await getAuthToken();
    const project = (await createTestProject(token)).data;
    const members = await request(app)
      .get(`/api/project-members/projects/${project.id}/members`)
      .set('Authorization', `Bearer ${token}`)
      .then(r => r.body.data);

    if (members.length > 1) {
      const res = await request(app)
        .delete(`/api/project-members/${members[1].id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    }
  });
});
