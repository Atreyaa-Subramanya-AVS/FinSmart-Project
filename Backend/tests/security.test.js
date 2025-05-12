const request = require('supertest');
const express = require('express');
const app = express();

// Simulated protected route for AI insight
app.use(express.json());
app.post('/api/ai/insight', (req, res) => {
  const { question } = req.body;

  // Fake auth check (replace with real session/passport logic)
  if (!req.headers.authorization || req.headers.authorization !== 'Bearer mock-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Input validation
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  return res.status(200).json({ reply: `AI-generated insight for: ${question}` });
});

describe('🔐 Security Tests', () => {
  it('should deny access without auth token', async () => {
    const res = await request(app).post('/api/ai/insight').send({ question: 'Am I saving enough?' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

  it('should return 400 for missing input', async () => {
    const res = await request(app)
      .post('/api/ai/insight')
      .set('Authorization', 'Bearer mock-token')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid input');
  });

  it('should allow valid request with auth', async () => {
    const res = await request(app)
      .post('/api/ai/insight')
      .set('Authorization', 'Bearer mock-token')
      .send({ question: 'What’s my spending pattern?' });
    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toContain('spending pattern');
  });
});
