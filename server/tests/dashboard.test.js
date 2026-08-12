// server/tests/dashboard.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

let token;
let userId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(config.mongoUri);
  }

  // Cleanup old test user if exists
  await User.deleteMany({ email: 'dash@example.com' });

  // Create a test user
  const user = await User.create({
    name: 'Dashboard Test',
    email: 'dash@example.com',
    password: 'Password123!',
    role: 'JOB_SEEKER',
  });
  userId = user._id;
  token = jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpire });
});

afterAll(async () => {
  await User.deleteMany({ email: 'dash@example.com' });
  await mongoose.connection.close();
});

describe('GET /api/dashboard', () => {
  it('should return user summary when authenticated', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user._id).toBe(userId.toString());
  });
});
