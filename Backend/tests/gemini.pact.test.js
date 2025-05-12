const path = require('path');
const { Pact } = require('@pact-foundation/pact');
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

// Mock Gemini endpoint using Pact
const provider = new Pact({
  consumer: 'FinSmartBackend',
  provider: 'GeminiAPI',
  port: 1234,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'INFO'
});

// Your backend route that calls Gemini
app.post('/api/ai/insight', async (req, res) => {
  const { question } = req.body;
  const fetch = require('node-fetch');

  const geminiRes = await fetch('http://localhost:1234/v1/ai/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: question })
  });

  const json = await geminiRes.json();
  res.status(200).json({ reply: json.reply });
});

describe('📄 Gemini API Contract Test', () => {
  beforeAll(() => provider.setup());

  afterAll(() => provider.finalize());

  it('should receive a valid Gemini reply', async () => {
    await provider.addInteraction({
      state: 'Gemini has a valid AI reply',
      uponReceiving: 'a request for AI insight',
      withRequest: {
        method: 'POST',
        path: '/v1/ai/reply',
        headers: { 'Content-Type': 'application/json' },
        body: { input: 'Show me savings' }
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { reply: 'Insight: Your savings increased by 20%.' }
      }
    });

    const res = await request(app)
      .post('/api/ai/insight')
      .send({ question: 'Show me savings' });

    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toContain('savings');

    await provider.verify();
  });
});
