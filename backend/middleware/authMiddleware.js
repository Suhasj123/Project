const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Not authorized: token missing from authorization header' });
      }

      // Check for mock token fallback (Strictly blocked in production)
      if (token.startsWith('mock_')) {
        if (process.env.NODE_ENV === 'production') {
          return res.status(401).json({ message: 'Mock authorization tokens are forbidden in production' });
        }

        const isAdminToken = token.includes('admin');
        
        // Strict guard: mock admin tokens require explicit local dev flag
        if (isAdminToken && process.env.ALLOW_DEV_MOCK_ADMIN !== 'true') {
          return res.status(403).json({ 
            message: 'Mock admin access is disabled. Please log in with valid admin credentials.' 
          });
        }

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

      // Verify JWT signature using verified secret
      const jwtSecret = process.env.JWT_SECRET || 'super_secret_bca_project_jwt_key_2026';
      const decoded = jwt.verify(token, jwtSecret);

      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        // Fallback user context if DB connection is intermittent
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Candidate',
          email: decoded.email,
          role: decoded.role || 'student'
        };
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User belonging to this token no longer exists' });
      }

      return next();
    } catch (error) {
      const isExpired = error.name === 'TokenExpiredError';
      return res.status(401).json({ 
        message: isExpired ? 'Session expired, please log in again' : 'Not authorized: invalid security token' 
      });
    }
  }

  return res.status(401).json({ message: 'Not authorized: no token provided' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Administrator privileges required' });
};

module.exports = { protect, adminOnly };
