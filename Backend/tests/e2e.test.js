const express = require('express');
const request = require('supertest');
const session = require('express-session');
const passport = require('passport');
const MockStrategy = require('passport-mock-strategy');

const app = express();
app.use(express.json());
app.use(session({ secret: 'test', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Patch req.logout to avoid 'cb is not a function' error in test env
app.use((req, res, next) => {
  req.logout = function (cb) {
    req.session.destroy(() => {
      cb && cb(); // support optional callback
    });
  };
  next();
});

// Step 1: Mock Google Login Strategy
passport.use(new MockStrategy({
  name: 'google',
  user: {
    id: 'user123',
    displayName: 'FinSmart User',
    emails: [{ value: 'finsmart@example.com' }]
  }
}, (user, done) => done(null, user)));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Step 2: OAuth Login Route
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.status(200).json({ user: req.user })
);

// Step 3: Protected AI Insight Route
app.post('/api/ai/insight', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Invalid input' });

  res.status(200).json({ reply: `Insight for: ${question}` });
});

// ✅ Step 4: Robust Logout Route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.status(200).json({ message: 'Logged out' });
  });
});


// ✅ E2E Tests
describe('⚙️ End-to-End User Flow', () => {
  const agent = request.agent(app); // maintains session

  it('should login with mock Google and get session', async () => {
    const res = await agent.get('/auth/google/callback');
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('displayName', 'FinSmart User');
  });

  it('should get AI insight after login', async () => {
    const res = await agent
      .post('/api/ai/insight')
      .send({ question: 'Tell me about my expenses' });

    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toContain('expenses');
  });

  it('should logout successfully', async () => {
    const res = await agent.get('/logout');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });

  it('should deny AI insight after logout', async () => {
    const res = await agent
      .post('/api/ai/insight')
      .send({ question: 'What’s next?' });

    expect(res.statusCode).toBe(401);
  });
});
