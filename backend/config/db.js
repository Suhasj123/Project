const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Disable command buffering so queries fail immediately if MongoDB is not connected
mongoose.set('bufferCommands', false);

let isMockMode = false;

const autoSeedIfEmpty = async () => {
  try {
    const Question = require('../models/Question');
    const Company = require('../models/Company');
    const Achievement = require('../models/Achievement');
    const User = require('../models/User');
    const { seedQuestions, seedCompanies, seedAchievements } = require('../utils/seedData');

    const qCount = await Question.countDocuments();
    if (qCount === 0) {
      await Question.insertMany(seedQuestions);
      console.log(`[Database] Seeded ${seedQuestions.length} Questions into MongoDB.`);
    }

    const cCount = await Company.countDocuments();
    if (cCount === 0) {
      await Company.insertMany(seedCompanies);
      console.log(`[Database] Seeded ${seedCompanies.length} Companies into MongoDB.`);
    }

    const aCount = await Achievement.countDocuments();
    if (aCount === 0) {
      await Achievement.insertMany(seedAchievements);
      console.log(`[Database] Seeded ${seedAchievements.length} Achievements into MongoDB.`);
    }

    const salt = await bcrypt.genSalt(10);
    const adminUser = await User.findOne({ email: 'suhasjsuhasj505@gmail.com' });
    if (!adminUser) {
      const adminHash = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'AdminMaster2026!', salt);
      await User.create({
        name: 'Suhas Admin',
        email: 'suhasjsuhasj505@gmail.com',
        password: adminHash,
        role: 'admin',
        targetRole: 'System Administrator'
      });
      console.log('[Database] Ensured Default Admin user exists in MongoDB.');
    }

    const adminUser2 = await User.findOne({ email: 'suhasjsuhasj123@gmail.com' });
    if (adminUser2 && adminUser2.role !== 'admin') {
      adminUser2.role = 'admin';
      await adminUser2.save();
      console.log('[Database] Promoted suhasjsuhasj123@gmail.com to Admin role.');
    }

    const studentUser = await User.findOne({ email: 'student@placement.com' });
    if (!studentUser) {
      const studentHash = await bcrypt.hash('Student2026!', salt);
      await User.create({
        name: 'Student Candidate',
        email: 'student@placement.com',
        password: studentHash,
        role: 'student',
        targetRole: 'Software Engineer'
      });
      console.log('[Database] Ensured Default Student user exists in MongoDB.');
    }
  } catch (err) {
    console.warn('[Database Seed Notice]', err.message);
  }
};

let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // If already connected, return cached connection
  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  const envUri = process.env.MONGODB_URI || '';
  const isPlaceholder = envUri.includes('<YOUR_PASSWORD>') || envUri.includes('<password>');
  const localUri = 'mongodb://127.0.0.1:27017/ai_interview_prep';

  // Strategy 1: Try Atlas / remote URI if configured
  if (envUri && !isPlaceholder) {
    try {
      if (!cached.promise) {
        cached.promise = mongoose.connect(envUri, {
          serverSelectionTimeoutMS: 5000,
          bufferCommands: false
        }).then(m => m);
      }
      cached.conn = await cached.promise;
      console.log(`[Database] MongoDB Atlas Connected: ${cached.conn.connection.host}`);
      isMockMode = false;
      await autoSeedIfEmpty();
      return cached.conn;
    } catch (err) {
      cached.promise = null;
      console.warn(`[Database Warning] Atlas connection attempt failed: ${err.message}`);
    }
  } else if (isPlaceholder) {
    console.warn(`[Database Warning] MONGODB_URI in .env contains placeholder '<YOUR_PASSWORD>'.`);
  }

  // Strategy 2: Try Local MongoDB (only when running locally, skip on Vercel or Render cloud)
  if (!process.env.VERCEL && !process.env.RENDER) {
    try {
      if (!cached.promise) {
        cached.promise = mongoose.connect(localUri, {
          serverSelectionTimeoutMS: 2000,
          bufferCommands: false
        }).then(m => m);
      }
      cached.conn = await cached.promise;
      console.log(`[Database] Local MongoDB Connected: ${cached.conn.connection.host}`);
      isMockMode = false;
      await autoSeedIfEmpty();
      return cached.conn;
    } catch (localErr) {
      cached.promise = null;
      isMockMode = true;
      console.warn(`[Database Warning] Local MongoDB on 127.0.0.1:27017 is not running (${localErr.message}).`);
      console.log(`[Database Info] Operating in Hybrid In-Memory Fallback Mode with full pre-seeded dataset.`);
    }
  } else {
    isMockMode = true;
    console.warn(`[Database Notice] Running on Cloud Hosting (Vercel/Render). Set MONGODB_URI in environment variables for database persistence.`);
  }
};

const getIsMockMode = () => isMockMode;

module.exports = { connectDB, getIsMockMode, autoSeedIfEmpty };
