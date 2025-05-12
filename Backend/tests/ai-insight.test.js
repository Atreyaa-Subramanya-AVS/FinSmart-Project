const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/ai/insight', (req, res) => {
  const { question } = req.body;
  if (question) {
    return res.status(200).json({ reply: 'AI-generated insight for: ' + question });
  }
  return res.status(400).json({ error: 'Missing input' });
});

describe('TC-05: AI Chatbot Insight', () => {
  it('should return a valid response from Gemini mock', async () => {
    const res = await request(app).post('/api/ai/insight').send({
      question: 'What are my savings trends?'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toContain('savings trends');
  });
});
