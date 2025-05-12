const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MockStrategy = require('passport-mock-strategy');

const app = express();

app.use(session({ secret: 'test', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new MockStrategy({
  name: 'google',
  user: {
    id: '12345',
    displayName: 'Test User',
    emails: [{ value: 'test@example.com' }]
  }
}, (user, done) => done(null, user)));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get('/auth/google', passport.authenticate('google')); 
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.status(200).json({ success: true, user: req.user });
  });

describe('Google OAuth Login', () => {
  it('should login successfully and redirect to dashboard', async () => {
    const res = await request(app).get('/auth/google/callback');
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('displayName', 'Test User');
  });
});
