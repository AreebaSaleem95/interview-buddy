const jwt = require('jsonwebtoken');
const { getConfig } = require('./env');

const getJwtConfig = () => getConfig();

const generateAccessToken = (userId) => {
  const cfg = getJwtConfig();
  const payload = { id: userId };
  return jwt.sign(payload, cfg.jwtAccessSecret, { expiresIn: cfg.jwtAccessExpire });
};

const generateRefreshToken = (userId) => {
  const cfg = getJwtConfig();
  const payload = { id: userId, type: 'refresh' };
  return jwt.sign(payload, cfg.jwtRefreshSecret, { expiresIn: cfg.jwtRefreshExpire });
};

const verifyAccessToken = (token) => {
  try {
    const cfg = getJwtConfig();
    return jwt.verify(token, cfg.jwtAccessSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token has expired. Please refresh your token.');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token.');
    }
    throw new Error('Token verification failed.');
  }
};

const verifyRefreshToken = (token) => {
  try {
    const cfg = getJwtConfig();
    const decoded = jwt.verify(token, cfg.jwtRefreshSecret);

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired. Please login again.');
    }
    throw new Error('Invalid refresh token.');
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Failed to decode token');
  }
};

const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length < 2) {
    return null;
  }

  const scheme = parts[0];
  if (scheme.toLowerCase() !== 'bearer') {
    return null;
  }

  const token = parts.slice(1).join(' ');
  return token || null;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  extractTokenFromHeader
};
