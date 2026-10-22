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

      // Verify JWT signature using verified secret
      const jwtSecret = process.env.JWT_SECRET || 'super_secret_bca_project_jwt_key_2026';
      const decoded = jwt.verify(token, jwtSecret);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
      }

      return next();
    } catch (error) {
      const isExpired = error.name === 'TokenExpiredError';
      return res.status(401).json({ 
        message: isExpired ? 'Session expired, please log in again.' : 'Not authorized: invalid security token.' 
      });
    }
  }

  return res.status(401).json({ message: 'Not authorized: no token provided.' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Administrator privileges required.' });
};

module.exports = { protect, adminOnly };
