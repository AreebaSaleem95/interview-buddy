const logger = require('../config/logger');
const { getConfig } = require('../config/env');
const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  let statusCode =
    err.statusCode ||
    err.status ||
    (err.name === 'ValidationError' ? 400 : undefined) ||
    (err.code === 11000 ? 400 : undefined) ||
    (err.name === 'CastError' ? 400 : undefined) ||
    (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError' ? 401 : undefined) ||
    (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError'
      ? 503
      : undefined) ||
    500;

  const config = getConfig();
  const requestMeta = {
    requestId: req.id,
    path: req.originalUrl,
    method: req.method,
    name: err.name,
    stack: err.stack
  };

  logger.error(err.message, requestMeta);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      data: null,
      errors: messages
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];

    return res.status(400).json({
      success: false,
      message: `${field} '${value}' already exists. Please use a different ${field}.`,
      data: null
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}. Please provide a valid ID.`,
      data: null
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Your session has expired. Please login again.',
      data: null
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token. Please login again.',
      data: null
    });
  }

  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({
      success: false,
      message: 'Database connection error. Please try again later.',
      data: null
    });
  }

  let message = err.message || 'Internal Server Error';
  const isOperational = err instanceof AppError && err.isOperational;

  if (statusCode === 500 && config.isProduction && !isOperational) {
    message = 'Internal Server Error';
  }

  const payload = {
    success: false,
    message,
    data: null
  };

  if (config.nodeEnv === 'development' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
