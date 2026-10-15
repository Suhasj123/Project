const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

    const uCount = await User.countDocuments();
    if (uCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const adminHash = await bcrypt.hash('admin12345', salt);
      const studentHash = await bcrypt.hash('password123', salt);

      await User.create([
        {
          name: 'Suhas Admin',
          email: 'suhasjsuhasj505@gmail.com',
          password: adminHash,
          role: 'admin',
          targetRole: 'System Administrator'
        },
        {
          name: 'Student Candidate',
          email: 'student@placement.com',
          password: studentHash,
          role: 'student',
          targetRole: 'Software Engineer'
        }
      ]);
      console.log('[Database] Seeded Default Admin and Student Users into MongoDB.');
    }
  } catch (err) {
    console.warn('[Database Seed Notice]', err.message);
  }
};

const connectDB = async () => {
  const envUri = process.env.MONGODB_URI || '';
  const isPlaceholder = envUri.includes('<YOUR_PASSWORD>') || envUri.includes('<password>');
  const localUri = 'mongodb://127.0.0.1:27017/ai_interview_prep';

  // Strategy 1: Try Atlas URI if valid and not a placeholder
  if (envUri && !isPlaceholder) {
    try {
      const conn = await mongoose.connect(envUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
      isMockMode = false;
      await autoSeedIfEmpty();
      return;
    } catch (err) {
      console.warn(`[Database Warning] Atlas connection attempt failed: ${err.message}`);
    }
  } else if (isPlaceholder) {
    console.warn(`[Database Warning] MONGODB_URI in .env contains placeholder '<YOUR_PASSWORD>'.`);
  }

  // Strategy 2: Try Local MongoDB
  try {
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] Local MongoDB Connected: ${conn.connection.host}`);
    isMockMode = false;
    await autoSeedIfEmpty();
    return;
  } catch (localErr) {
    // Both Atlas and Local MongoDB unavailable
    isMockMode = true;
    console.warn(`[Database Warning] Local MongoDB on 127.0.0.1:27017 is not running (${localErr.message}).`);
    console.log(`[Database Info] Operating in Hybrid In-Memory Fallback Mode with full pre-seeded dataset.`);
  }
};

const getIsMockMode = () => isMockMode;

module.exports = { connectDB, getIsMockMode, autoSeedIfEmpty };
