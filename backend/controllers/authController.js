const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const { sendCandidateEmail } = require('../services/emailService');

// Helper token generator
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'super_secret_bca_project_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// Standard Password Policy Validator (Min 8 chars, 1 uppercase, 1 lowercase, 1 number)
const verifyPasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return 'Password is required and must be text.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z).';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number (0-9).';
  }
  return true;
};

// Optional Phone Number Validator (Strictly 10 digits, 0-9 only)
const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    return true; // Phone is optional
  }
  const cleanPhone = phone.trim();
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return 'Phone number must contain exactly 10 digits (0-9) with no letters, spaces, or special characters.';
  }
  return true;
};

// 1. Student Candidate Registration
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address format.' });
    }

    // Phone validation (Optional, exactly 10 digits if provided)
    const phoneValidation = validatePhone(phone);
    if (phoneValidation !== true) {
      return res.status(400).json({ message: phoneValidation });
    }

    // Password strength check
    const pwdValidation = verifyPasswordStrength(password);
    if (pwdValidation !== true) {
      return res.status(400).json({ message: pwdValidation });
    }

    // Confirm password matching check
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password do not match.' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: 'MongoDB database is not connected. In Vercel Project Settings, add MONGODB_URI (e.g. MongoDB Atlas).'
      });
    }

    // Check if email already registered in MongoDB
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered. Please log in.' });
    }

    // Secure password hashing with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const cleanPhone = phone && phone.trim() !== '' ? phone.trim() : '';

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: 'student'
    });

    // Send optional welcome email asynchronously if SMTP is configured
    sendCandidateEmail({
      toEmail: newUser.email,
      candidateName: newUser.name,
      subject: 'Welcome to InterviewPro - AI Interview Preparation System',
      message: `Hello ${newUser.name},\n\nYour student candidate account has been created successfully.\n\nPlease log in at http://localhost:3000/login using your registered email and password.\n\nBest regards,\nInterviewPro Talent Team`,
      decision: 'Welcome'
    }).catch(err => console.warn('[Email Dispatch Notice]', err.message));

    // Return success without auto-login so candidate logs in explicitly
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please log in.',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('[Register Error]', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email is already registered. Please log in.' });
    }
    return res.status(500).json({ message: 'Server error during registration: ' + error.message });
  }
};

// 2. Login User (Strict MongoDB Verification: Email & Password Compulsory)
exports.loginUser = async (req, res) => {
  try {
    const { email, password, phone, loginMode } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Optional phone validation if supplied
    if (phone && phone.trim() !== '') {
      const phoneValidation = validatePhone(phone);
      if (phoneValidation !== true) {
        return res.status(400).json({ message: phoneValidation });
      }
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: 'MongoDB database is not connected. In Vercel Project Settings, add MONGODB_URI (e.g. MongoDB Atlas).'
      });
    }

    // 1. Look up existing registered user record in MongoDB
    const user = await User.findOne({ email: cleanEmail });

    // If the user is not registered, display exact message:
    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please create a student account.' });
    }

    // 2. Verify password against MongoDB bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 3. Admin Console Authorization Verification
    // Never grant admin access merely because someone selects the Admin Console option
    if (loginMode === 'admin' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: You do not have administrator privileges.' });
    }

    // Update phone in MongoDB if candidate provided a new valid 10-digit phone
    if (phone && phone.trim() !== '' && phone.trim() !== user.phone) {
      user.phone = phone.trim();
      await user.save();
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        targetRole: user.targetRole,
        streakDays: user.streakDays || 1,
        readinessScore: user.readinessScore || 65,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return res.status(500).json({ message: 'Server error during login: ' + error.message });
  }
};

// 3. Request Password Reset (No OTP, Secure Single-Use Token)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Please provide your registered email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    // Check if real SMTP delivery is configured in environment
    const isEmailDeliveryConfigured = Boolean(
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS &&
      process.env.SMTP_HOST !== 'smtp.ethereal.email'
    );

    if (!user) {
      // Do not reveal email existence to prevent user enumeration
      if (!isEmailDeliveryConfigured) {
        return res.status(200).json({
          success: false,
          emailConfigured: false,
          message: 'Password reset email delivery is not configured on this server. Please contact your system administrator.'
        });
      }
      return res.status(200).json({
        success: true,
        emailConfigured: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.'
      });
    }

    // Generate single-use secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store hash and set 1-hour expiration
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save();

    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendBaseUrl}/reset-password?token=${resetToken}`;

    if (!isEmailDeliveryConfigured) {
      return res.status(200).json({
        success: false,
        emailConfigured: false,
        message: 'Password reset email delivery is not configured on this server. Please contact your system administrator.',
        // Dev assistance link when running in development
        devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined
      });
    }

    // Dispatch email with reset link
    const emailResult = await sendCandidateEmail({
      toEmail: user.email,
      candidateName: user.name,
      subject: 'InterviewPro Password Reset Request',
      message: `Hello ${user.name},\n\nYou requested to reset your password.\n\nPlease click the link below to set a new password:\n${resetUrl}\n\nThis single-use link expires in 60 minutes.\nIf you did not request this, please ignore this email.\n\nBest regards,\nInterviewPro Security Team`,
      decision: 'Password Reset'
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to deliver password reset email. Please try again later.'
      });
    }

    return res.status(200).json({
      success: true,
      emailConfigured: true,
      message: 'Password reset link has been dispatched to your email address.'
    });
  } catch (error) {
    console.error('[Forgot Password Error]', error);
    return res.status(500).json({ message: 'Error processing password reset request: ' + error.message });
  }
};

// 4. Reset Password using Single-Use Token (No OTP)
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Password reset token is missing or invalid.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'New password is required.' });
    }

    // Validate password policy
    const pwdValidation = verifyPasswordStrength(password);
    if (pwdValidation !== true) {
      return res.status(400).json({ message: pwdValidation });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password do not match.' });
    }

    // Hash token to verify against stored hash in MongoDB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset link. Please request a new one.' });
    }

    // Hash new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Invalidate reset token after successful use
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. Please log in with your new password.'
    });
  } catch (error) {
    console.error('[Reset Password Error]', error);
    return res.status(500).json({ message: 'Error resetting password: ' + error.message });
  }
};

// 5. Get Current User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
};

// 6. Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, targetRole, profilePic } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) {
      const phoneValidation = validatePhone(phone);
      if (phoneValidation !== true) {
        return res.status(400).json({ message: phoneValidation });
      }
      user.phone = phone.trim();
    }
    if (targetRole) user.targetRole = targetRole.trim();
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    return res.json({
      message: 'Profile updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        targetRole: user.targetRole,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
};

module.exports.verifyPasswordStrength = verifyPasswordStrength;
module.exports.validatePhone = validatePhone;
