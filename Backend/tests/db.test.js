const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany(); // Clear DB after each test
});

describe('Database Tests', () => {
  it('should save a valid user', async () => {
    const user = new User({ email: 'test@example.com', name: 'Kruthik' });
    const savedUser = await user.save();
    expect(savedUser.email).toBe('test@example.com');
  });

  it('should not save a user without email', async () => {
    const user = new User({ name: 'Atreyaa' });
    let err;
    try {
      await user.save();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  it('should not allow duplicate emails', async () => {
    await User.create({ email: 'unique@example.com' });
    let err;
    try {
      await User.create({ email: 'unique@example.com' });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error
  });
});
