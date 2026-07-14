const request = require('supertest');
const { app } = require('./setup');
const { getAuthToken } = require('./helpers');

describe('Notifications — GET /api/notifications', () => {
  it('should return notifications list', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.notifications).toBeDefined();
    expect(res.body.data.unreadCount).toBeDefined();
  });
});

describe('Notifications — GET /api/notifications/unread-count', () => {
  it('should return unread count', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/notifications/unread-count')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.data.unreadCount).toBe('number');
  });
});

describe('Notifications — POST /api/notifications/mark-all-read', () => {
  it('should mark all as read', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post('/api/notifications/mark-all-read')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Notifications — PATCH /api/notifications/:id/read', () => {
  it('should return 404 for non-existent notification', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .patch('/api/notifications/00000000-0000-0000-0000-000000000099/read')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
