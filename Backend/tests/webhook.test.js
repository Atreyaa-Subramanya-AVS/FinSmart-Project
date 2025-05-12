const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/webhook/ai-progress', (req, res) => {
  const { userId, status, progress } = req.body;
  if (!userId || !status) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  res.status(200).json({ received: true });
});

describe('Webhook: AI Progress Callback', () => {
  it('should accept valid webhook callback', async () => {
    const res = await request(app).post('/api/webhook/ai-progress').send({
      userId: '12345',
      status: 'processing',
      progress: 40
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ received: true });
  });

  it('should reject invalid webhook data', async () => {
    const res = await request(app).post('/api/webhook/ai-progress').send({
      progress: 80
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
