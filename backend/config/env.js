const Joi = require('joi');

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .empty('')
    .default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(5000),
  MONGODB_URI: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRE: Joi.string().default('1h'),
  JWT_REFRESH_EXPIRE: Joi.string().default('30d'),
  CLIENT_URL: Joi.string().required(),
  TRUST_PROXY: Joi.boolean().truthy('true').falsy('false').default(false),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(100),
  AUTH_RATE_LIMIT_MAX: Joi.number().integer().min(1).default(25),
  BODY_LIMIT_MB: Joi.number().min(0.1).max(50).default(50),
  MONGO_MAX_POOL_SIZE: Joi.number().integer().min(5).max(100).default(10),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly').optional(),
  SHUTDOWN_TIMEOUT_MS: Joi.number().integer().min(1000).max(120000).default(10000)
})
  .unknown(true)
  .prefs({ abortEarly: false });

function parseClientOrigins(clientUrl) {
  return clientUrl
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function loadEnv() {
  const { error, value } = envSchema.validate(process.env, { abortEarly: false });

  if (error) {
    const msg = error.details.map((d) => d.message).join('; ');
    throw new Error(`Environment validation failed: ${msg}`);
  }

  const clientUrls = parseClientOrigins(value.CLIENT_URL);

  return {
    nodeEnv: value.NODE_ENV,
    isProduction: value.NODE_ENV === 'production',
    port: value.PORT,
    mongoUri: value.MONGODB_URI,
    jwtAccessSecret: value.JWT_ACCESS_SECRET,
    jwtRefreshSecret: value.JWT_REFRESH_SECRET,
    jwtAccessExpire: value.JWT_ACCESS_EXPIRE,
    jwtRefreshExpire: value.JWT_REFRESH_EXPIRE,
    clientUrl: value.CLIENT_URL,
    clientUrls,
    trustProxy: value.TRUST_PROXY,
    rateLimitWindowMs: value.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: value.RATE_LIMIT_MAX,
    authRateLimitMax: value.AUTH_RATE_LIMIT_MAX,
    bodyLimitMb: value.BODY_LIMIT_MB,
    mongoMaxPoolSize: value.MONGO_MAX_POOL_SIZE,
    logLevel: value.LOG_LEVEL,
    shutdownTimeoutMs: value.SHUTDOWN_TIMEOUT_MS
  };
}

let cached;

function getConfig() {
  if (!cached) {
    cached = loadEnv();
  }
  return cached;
}

module.exports = {
  loadEnv,
  getConfig,
  parseClientOrigins
};
