const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * 1. HTTP Security Headers via Helmet
 */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*", "https://*"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
});

/**
 * 2. Rate Limiters
 */

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in 15 minutes.'
  }
});

// Strict Auth rate limiter (prevents brute force / credential stuffing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login or registration attempts. Please wait 15 minutes before trying again.'
  }
});

// AI endpoints limiter (protects OpenAI / Gemini token budgets)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI generation quota exceeded for this interval. Please try again shortly.'
  }
});

// Email dispatch limiter
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many email requests dispatched. Please wait before sending more emails.'
  }
});

/**
 * 3. NoSQL Injection & Request Body Sanitizer
 * Strips MongoDB operator keys (keys starting with $ or containing .)
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Block MongoDB query injection operators ($gt, $ne, $where, etc.)
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    } else if (typeof value === 'string') {
      // Basic XSS escaping for common malicious injection payloads
      clean[key] = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

/**
 * 4. Secure CORS configuration
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3002,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:3002')
  .split(',')
  .map(o => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or listed origins
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Access from origin ' + origin + ' is not allowed.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours preflight cache
};

module.exports = {
  securityHeaders,
  generalLimiter,
  authLimiter,
  aiLimiter,
  emailLimiter,
  sanitizeInput,
  corsOptions
};
