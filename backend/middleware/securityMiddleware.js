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
  max: 300,
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
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:4173'
];

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

const isOriginAllowed = (origin) => {
  // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
  if (!origin) return true;

  // Exact match or wildcard match
  if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return true;

  // Allow all Vercel deployed frontend origins (project-suhas-3e82.vercel.app, previews, etc.)
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;

  // Allow all Render deployed origins
  if (/^https:\/\/.*\.onrender\.com$/.test(origin)) return true;

  // In non-production or local environment, automatically allow all localhost & 127.0.0.1 ports
  if (process.env.NODE_ENV !== 'production') {
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (isLocalhost) return true;
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Access from origin ' + origin + ' is not allowed.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
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
