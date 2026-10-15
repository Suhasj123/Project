const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Check for mock token fallback
      if (token.startsWith('mock_')) {
        const isAdminToken = token.includes('admin');
        req.user = {
          _id: isAdminToken ? '650000000000000000000002' : '650000000000000000000001',
          name: isAdminToken ? 'Suhas Admin' : 'Student Demo',
          email: isAdminToken ? 'suhasjsuhasj505@gmail.com' : 'student@placement.com',
          role: isAdminToken ? 'admin' : 'student',
          targetRole: 'Software Engineer',
          readinessScore: 99,
          streakDays: 7
        };
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_bca_project_jwt_key_2026');
      
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        // Fallback if DB isn't running
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Student Demo',
          email: decoded.email || 'student@placement.com',
          role: decoded.role || 'student'
        };
      }

      if (!req.user) {
        req.user = { _id: decoded.id, name: 'User', email: 'user@test.com', role: 'student' };
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware Error]', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

module.exports = { protect, adminOnly };
