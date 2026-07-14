const request = require('supertest');
const { app } = require('./setup');

describe('GET /health', () => {
  it('should return OK status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.environment).toBe('test');
  });
});
