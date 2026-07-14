const request = require('supertest');
const { app } = require('./setup');
const { TEST_ADMIN, TEST_MEMBER, getAuthToken, loginUser, registerUser } = require('./helpers');

describe('Auth — POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(TEST_ADMIN);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(TEST_ADMIN.email);
  });

  it('should reject duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(TEST_ADMIN);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...TEST_ADMIN, email: 'invalid-email' });
    expect(res.status).toBe(400);
  });

  it('should reject weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...TEST_ADMIN, email: 'weak@test.com', password: '123' });
    expect(res.status).toBe(400);
  });
});

describe('Auth — POST /api/auth/login', () => {
  it('should login successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_ADMIN.email, password: 'WrongPass123' });
    expect(res.status).toBe(401);
  });

  it('should reject non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'Test1234' });
    expect(res.status).toBe(401);
  });
});

describe('Auth — GET /api/auth/profile', () => {
  it('should return profile when authenticated', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(TEST_ADMIN.email);
  });

  it('should reject without token', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });
});

describe('Auth — PUT /api/auth/profile', () => {
  it('should update profile', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.firstName).toBe('Updated');
  });
});

describe('Auth — PUT /api/auth/change-password', () => {
  it('should change password', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: TEST_ADMIN.password, newPassword: 'NewPass123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should login with new password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_ADMIN.email, password: 'NewPass123' });
    expect(res.status).toBe(200);
  });

  it('should reject wrong current password', async () => {
    const token = await getAuthToken(TEST_ADMIN.email, 'NewPass123');
    const res = await request(app)
      .put('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'WrongPass123', newPassword: 'Another123' });
    expect(res.status).toBe(400);
  });
});

describe('Auth — POST /api/auth/forgot-password', () => {
  it('should generate reset token for existing email', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: TEST_ADMIN.email });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.resetToken).toBeDefined();
  });

  it('should not reveal if email does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'unknown@test.com' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.resetToken).toBeUndefined();
  });
});

describe('Auth — POST /api/auth/reset-password', () => {
  it('should reset password with valid token', async () => {
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: TEST_ADMIN.email });
    const resetToken = forgotRes.body.resetToken;

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: resetToken, newPassword: TEST_ADMIN.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'invalid-token', newPassword: 'Test1234' });
    expect(res.status).toBe(400);
  });
});

describe('Auth — POST /api/auth/logout', () => {
  it('should logout successfully', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
