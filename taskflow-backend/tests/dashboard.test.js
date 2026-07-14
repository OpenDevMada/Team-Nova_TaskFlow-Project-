const request = require('supertest');
const { app } = require('./setup');
const { getAuthToken, createTestProject } = require('./helpers');

describe('Dashboard — GET /api/dashboard/stats', () => {
  it('should return stats', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalProjects).toBeDefined();
    expect(res.body.data.totalTasks).toBeDefined();
    expect(res.body.data.completionRate).toBeDefined();
    expect(res.body.data.totalMembers).toBeDefined();
  });
});

describe('Dashboard — GET /api/dashboard/recent-projects', () => {
  it('should return recent projects', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/dashboard/recent-projects')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Dashboard — GET /api/dashboard/recent-tasks', () => {
  it('should return recent tasks', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/dashboard/recent-tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
