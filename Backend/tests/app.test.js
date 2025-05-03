const request = require('supertest');
const app = require('../app');

describe('FinSmart API Tests', () => {
  it('GET / should return API running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/FinSmart API/i);
  });

  it('POST /api/chat should return a reply or error', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ history: [{ role: 'user', content: 'Hi' }] });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reply');
  });

  it('POST /api/recommend should return financial advice or error', async () => {
    const res = await request(app)
      .post('/api/recommend')
      .send({
        Data: {
          income: 5000,
          expenses: 2000,
        },
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('recommendation');
  });
});
