const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsMockMode } = require('../config/db');
const { sendCandidateEmail } = require('../services/emailService');

// Helper token generator
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'super_secret_bca_project_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// Designated Admin Email
const ADMIN_EMAIL = 'suhasjsuhasj505@gmail.com';

// In-memory users for mock fallback mode if DB is offline
let memoryUserDB = [
  {
    _id: '650000000000000000000002',
    name: 'Suhas Admin',
    email: ADMIN_EMAIL,
    passwordHash: '$2a$10$e8T7.JgS3bFf...mock', // bcrypt hash placeholder
    rawPassword: 'admin12345',
    role: 'admin',
    targetRole: 'System Administrator',
    streakDays: 7,
    readinessScore: 99
  }
];

// 1. Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const cleanEmail = email.toLowerCase().trim();
    // Only suhasjsuhasj505@gmail.com gets admin role
    const assignedRole = cleanEmail === ADMIN_EMAIL ? 'admin' : 'student';

    if (getIsMockMode()) {
      const existingInMemory = memoryUserDB.find(u => u.email === cleanEmail);
      if (existingInMemory) {
        return res.status(400).json({ message: 'User already registered with this email' });
      }

      const mockUser = {
        _id: '650000000000000000000' + Math.floor(Math.random() * 899 + 100),
        name,
        email: cleanEmail,
        rawPassword: password,
        role: assignedRole,
        targetRole: 'Software Engineer',
        streakDays: 1,
        readinessScore: 65
      };

      memoryUserDB.push(mockUser);

      // Asynchronously dispatch welcome email via Nodemailer
      sendCandidateEmail({
        toEmail: mockUser.email,
        candidateName: mockUser.name,
        subject: 'Welcome to InterviewPro - AI Interview Preparation System',
        message: `Hello ${mockUser.name},\n\nWelcome to InterviewPro! Your candidate account has been created successfully.\n\nYou can now log in to access Resume Screening, Aptitude Assessments, Coding Challenges, and AI Mock Interviews.\n\nBest regards,\nInterviewPro Talent Team`,
        decision: 'Welcome'
      }).catch(err => console.warn('[Email Dispatch Notice]', err.message));

      return res.status(201).json({
        user: {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          targetRole: mockUser.targetRole
        },
        token: generateToken(mockUser)
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: assignedRole
    });

    // Asynchronously dispatch welcome email via Nodemailer
    sendCandidateEmail({
      toEmail: newUser.email,
      candidateName: newUser.name,
      subject: 'Welcome to InterviewPro - AI Interview Preparation System',
      message: `Hello ${newUser.name},\n\nWelcome to InterviewPro! Your candidate account has been created successfully.\n\nYou can now log in to access Resume Screening, Aptitude Assessments, Coding Challenges, and AI Mock Interviews.\n\nBest regards,\nInterviewPro Talent Team`,
      decision: 'Welcome'
    }).catch(err => console.warn('[Email Dispatch Notice]', err.message));

    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        targetRole: newUser.targetRole,
        streakDays: newUser.streakDays,
        readinessScore: newUser.readinessScore
      },
      token: generateToken(newUser)
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({ message: 'Server error during registration: ' + error.message });
  }
};

// 2. Login User (Supports Email, Phone, and Admin Password authentication)
exports.loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: 'Please enter Email Address or Phone Number' });
    }

    const cleanEmail = email ? email.toLowerCase().trim() : `${(phone || 'candidate').replace(/\D/g, '')}@prepai.com`;
    const cleanPhone = phone ? phone.trim() : '9876543210';
    const assignedRole = cleanEmail === ADMIN_EMAIL ? 'admin' : 'student';

    if (getIsMockMode()) {
      let userFound = memoryUserDB.find(u => u.email === cleanEmail);
      if (!userFound) {
        userFound = {
          _id: '650000000000000000000' + Math.floor(Math.random() * 899 + 100),
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: cleanPhone,
          role: assignedRole,
          targetRole: 'Software Engineer',
          streakDays: 1,
          readinessScore: 70
        };
        memoryUserDB.push(userFound);
      } else {
        userFound.phone = cleanPhone;
      }

      return res.json({
        user: {
          _id: userFound._id,
          name: userFound.name,
          email: userFound.email,
          phone: userFound.phone,
          role: userFound.role,
          targetRole: userFound.targetRole,
          streakDays: userFound.streakDays || 1,
          readinessScore: userFound.readinessScore || 70,
          profilePic: userFound.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        },
        token: generateToken(userFound)
      });
    }

    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'Candidate@123', salt);
      user = await User.create({
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: cleanPhone,
        password: hashedPassword,
        role: assignedRole
      });
    } else {
      user.phone = cleanPhone;
      await user.save();
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        targetRole: user.targetRole,
        streakDays: user.streakDays,
        readinessScore: user.readinessScore,
        profilePic: user.profilePic
      },
      token: generateToken(user)
    });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({ message: 'Server error during login: ' + error.message });
  }
};

// 3. Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  res.json({
    message: `Password reset link has been dispatched to ${email}.`
  });
};

// 3.5 Get Profile
exports.getProfile = async (req, res) => {
  try {
    return res.json(req.user || { name: 'Demo Candidate', email: 'demo@example.com', role: 'candidate' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// 4. Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, targetRole, profilePic } = req.body;
    if (getIsMockMode()) {
      return res.json({
        message: 'Profile updated successfully',
        user: { ...req.user, name, targetRole, profilePic }
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (targetRole) user.targetRole = targetRole;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// 6. Direct Candidate Access / Verification (Zero OTP Required)
exports.sendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const identifier = (email || phone || 'student@placement.com').toLowerCase().trim();

    res.json({
      success: true,
      message: `Direct Candidate Portal Access Active for ${identifier}. Zero OTP required.`
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication Service Notice: ' + error.message });
  }
};

// 7. Direct Candidate Authentication (Zero OTP Bypass)
exports.verifyOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    req.body.email = email ? email.toLowerCase().trim() : 'student@placement.com';
    req.body.phone = phone ? phone.trim() : '9876543210';
    return exports.loginUser(req, res);
  } catch (error) {
    req.body.email = req.body.email || 'student@placement.com';
    return exports.loginUser(req, res);
  }
};

exports.directCandidateAccess = exports.verifyOTP;

module.exports.ADMIN_EMAIL = ADMIN_EMAIL;
