const rateLimit = require('express-rate-limit');
const { getConfig } = require('../config/env');

function buildApiLimiter() {
  const config = getConfig();
  return rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      const path = req.originalUrl.split('?')[0];
      return path === '/api/health' || path.endsWith('/api/health');
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        data: null
      });
    }
  });
}

function buildAuthLimiter() {
  const config = getConfig();
  return rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.authRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many authentication attempts, please try again later.',
        data: null
      });
    }
  });
}

module.exports = {
  buildApiLimiter,
  buildAuthLimiter
};
