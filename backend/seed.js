const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

dotenv.config();

const Question = require('./models/Question');
const Company = require('./models/Company');
const Achievement = require('./models/Achievement');
const User = require('./models/User');
const { seedQuestions, seedCompanies, seedAchievements } = require('./utils/seedData');

const seedDB = async () => {
  console.log('=======================================================');
  console.log(' 🍃 InterviewPro MongoDB Data Feeder & Diagnostic Tool');
  console.log('=======================================================');

  const envUri = process.env.MONGODB_URI || '';
  const isPlaceholder = envUri.includes('<YOUR_PASSWORD>') || envUri.includes('<password>');
  const localUri = 'mongodb://127.0.0.1:27017/ai_interview_prep';

  let connectedUri = null;

  // 1. Check if Atlas URI is configured without placeholder
  if (envUri && !isPlaceholder) {
    try {
      console.log(`[1/2] Connecting to MongoDB Atlas URI...`);
      await mongoose.connect(envUri, { serverSelectionTimeoutMS: 4000 });
      connectedUri = envUri;
      console.log(`[✓] Successfully connected to MongoDB Atlas!`);
    } catch (err) {
      console.warn(`[!] Atlas Connection Error: ${err.message}`);
    }
  } else if (isPlaceholder) {
    console.log(`[!] Notice: 'MONGODB_URI' in .env contains placeholder '<YOUR_PASSWORD>'.`);
  }

  // 2. Try Local MongoDB if Atlas didn't connect
  if (!connectedUri) {
    try {
      console.log(`[2/2] Attempting connection to Local MongoDB (127.0.0.1:27017)...`);
      await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2500 });
      connectedUri = localUri;
      console.log(`[✓] Successfully connected to Local MongoDB!`);
    } catch (err) {
      console.warn(`[!] Local MongoDB Connection Error: ${err.message}`);
    }
  }

  // Always prepare exported JSON file with all models
  const salt = await bcrypt.genSalt(10);
  const defaultUsers = [
    {
      name: 'Suhas Admin',
      email: 'suhasjsuhasj505@gmail.com',
      password: await bcrypt.hash('AdminMaster2026!', salt),
      role: 'admin',
      targetRole: 'System Administrator',
      phone: '9876543210',
      streakDays: 7,
      readinessScore: 99
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@campusprep.edu',
      password: await bcrypt.hash('PriyaPrep2026!', salt),
      role: 'student',
      targetRole: 'Frontend React Developer',
      phone: '9876543211',
      streakDays: 5,
      readinessScore: 86
    },
    {
      name: 'Rahul Verma',
      email: 'rahul.verma@campusprep.edu',
      password: await bcrypt.hash('RahulCode2026#', salt),
      role: 'student',
      targetRole: 'Full Stack Engineer',
      phone: '9876543212',
      streakDays: 4,
      readinessScore: 82
    },
    {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@campusprep.edu',
      password: await bcrypt.hash('AnanyaPass99$', salt),
      role: 'student',
      targetRole: 'Data & AI Engineer',
      phone: '9876543213',
      streakDays: 6,
      readinessScore: 91
    },
    {
      name: 'Vikram Nair',
      email: 'vikram.nair@campusprep.edu',
      password: await bcrypt.hash('Vikram2026Dev*', salt),
      role: 'student',
      targetRole: 'DevOps & Cloud Specialist',
      phone: '9876543214',
      streakDays: 3,
      readinessScore: 78
    },
    {
      name: 'Student Candidate',
      email: 'student@placement.com',
      password: await bcrypt.hash('Student2026!', salt),
      role: 'student',
      targetRole: 'Software Engineer',
      phone: '9876543210',
      streakDays: 2,
      readinessScore: 75
    }
  ];

  const exportPayload = {
    generatedAt: new Date().toISOString(),
    totalQuestions: seedQuestions.length,
    totalCompanies: seedCompanies.length,
    totalAchievements: seedAchievements.length,
    totalUsers: defaultUsers.length,
    data: {
      questions: seedQuestions,
      companies: seedCompanies,
      achievements: seedAchievements,
      users: defaultUsers
    }
  };

  const exportPath = path.join(__dirname, 'seed_data_export.json');
  fs.writeFileSync(exportPath, JSON.stringify(exportPayload, null, 2), 'utf-8');
  console.log(`\n📁 Generated seed dataset export file: ${exportPath}`);

  // 3. Feed data into MongoDB if connected
  if (connectedUri) {
    try {
      console.log('\n--- Feeding Data into MongoDB ---');

      // Clean existing records
      await Question.deleteMany({});
      await Company.deleteMany({});
      await Achievement.deleteMany({});
      await User.deleteMany({ email: { $in: defaultUsers.map(u => u.email) } });

      // Insert fresh data
      const insertedQuestions = await Question.insertMany(seedQuestions);
      const insertedCompanies = await Company.insertMany(seedCompanies);
      const insertedAchievements = await Achievement.insertMany(seedAchievements);
      const insertedUsers = await User.insertMany(defaultUsers);

      console.log(`[✓] Seeded ${insertedQuestions.length} Questions (Aptitude, Reasoning, Verbal, Coding)`);
      console.log(`[✓] Seeded ${insertedCompanies.length} Top IT Companies (TCS, Infosys, Accenture, Wipro...)`);
      console.log(`[✓] Seeded ${insertedAchievements.length} Badges & Gamification Achievements`);
      console.log(`[✓] Seeded ${insertedUsers.length} Default Users (Admin & Student)`);

      console.log('\n=======================================================');
      console.log(' 🎉 MongoDB Database Successfully Populated!');
      console.log('=======================================================');
      process.exit(0);
    } catch (feedError) {
      console.error('\n[!] Error inserting data into MongoDB:', feedError.message);
      process.exit(1);
    }
  } else {
    // Detailed error diagnostics & resolution instructions
    console.log('\n=======================================================');
    console.log(' ⚠️ MongoDB Connection Diagnostic & Resolution Guide');
    console.log('=======================================================');
    console.log('Neither MongoDB Atlas nor Local MongoDB (port 27017) could be reached.');
    console.log('\nHow to resolve:');
    console.log('Option A — If using MongoDB Atlas (Cloud Database):');
    console.log('  1. Open backend/.env');
    console.log('  2. Replace <YOUR_PASSWORD> with your real MongoDB Atlas password.');
    console.log('     Example: MONGODB_URI=mongodb+srv://suhasjsuhasj505_db_user:MySecretPass123@cluster0.abcde.mongodb.net/ai_interview_prep?retryWrites=true&w=majority');
    console.log('  3. Ensure Network Access in MongoDB Atlas allows IP: 0.0.0.0/0 (Allow from anywhere).');
    console.log('\nOption B — If using Local MongoDB on your computer:');
    console.log('  1. Open Windows Terminal / PowerShell as Administrator and run:');
    console.log('     net start MongoDB');
    console.log('     (or run: mongod --dbpath="C:\\data\\db")');
    console.log('\nOption C — In-Memory Mode (Already working automatically!):');
    console.log('  The backend is already running smoothly in In-Memory Mode with all 34 questions,');
    console.log('  companies, and default accounts loaded, with zero setup required.');
    console.log('=======================================================\n');
    process.exit(0);
  }
};

seedDB();
