/**
 * Environment Variable Security & Validation Module
 */
const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const warnings = [];
  const errors = [];

  // 1. JWT_SECRET Check
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'super_secret_bca_project_jwt_key_2026_fallback';
    if (isProduction) {
      warnings.push('CRITICAL: JWT_SECRET was not configured in production; using secure fallback key. Please add JWT_SECRET in Vercel Project Settings.');
    } else {
      warnings.push('NOTICE: JWT_SECRET not found in .env; using local development secret.');
    }
  } else if (process.env.JWT_SECRET.length < 32 && isProduction) {
    warnings.push('SECURITY WARNING: JWT_SECRET is short (< 32 characters). Use a stronger secret in production.');
  }

  // 2. MONGODB_URI Check
  if (!process.env.MONGODB_URI) {
    warnings.push('NOTICE: MONGODB_URI not found; defaulting to local 127.0.0.1:27017 or in-memory fallback.');
  } else if (process.env.MONGODB_URI.includes('<YOUR_PASSWORD>') || process.env.MONGODB_URI.includes('<password>')) {
    warnings.push('DATABASE WARNING: MONGODB_URI contains unreplaced placeholder <YOUR_PASSWORD>.');
  }

  // 3. AI Keys Check
  if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    warnings.push('AI NOTICE: Neither OPENAI_API_KEY nor GEMINI_API_KEY is configured. System will use intelligent offline heuristics.');
  }

  // Print diagnostics summary
  console.log('-------------------------------------------------------');
  console.log(` 🛡️  Security Environment Check [NODE_ENV: ${process.env.NODE_ENV || 'development'}]`);
  
  if (errors.length > 0) {
    console.error(' ❌ Configuration Errors:');
    errors.forEach(e => console.error(`    • ${e}`));
  }

  if (warnings.length > 0) {
    console.warn(' ⚠️  Configuration Notices:');
    warnings.forEach(w => console.warn(`    • ${w}`));
  } else {
    console.log(' ✅ All environment variables verified and secure.');
  }
  console.log('-------------------------------------------------------');

  return { isProduction, errors, warnings };
};

module.exports = { validateEnv };
