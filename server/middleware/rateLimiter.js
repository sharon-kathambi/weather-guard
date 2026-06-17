const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      500,
  standardHeaders: true,
  legacyHeaders:   false,
  // Trust Render's proxy so rate limiting is per real IP, not per proxy IP
  keyGenerator: (req) => req.headers['x-forwarded-for']?.split(',')[0] || req.ip,
  message: { error: 'Too many requests — please try again later.' },
});

module.exports = { rateLimiter };