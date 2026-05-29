const winston = require('winston');
const { getConfig } = require('./env');

function createLogger() {
  let config;
  try {
    config = getConfig();
  } catch {
    config = { nodeEnv: process.env.NODE_ENV || 'development', logLevel: process.env.LOG_LEVEL };
  }

  const level =
    config.logLevel ||
    (config.nodeEnv === 'production' ? 'info' : 'debug');

  const jsonFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  );

  const devFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level: lvl, message, timestamp, stack, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} [${lvl}] ${message}${stack ? `\n${stack}` : ''}${metaStr}`;
    })
  );

  return winston.createLogger({
    level,
    format: config.nodeEnv === 'production' ? jsonFormat : devFormat,
    transports: [new winston.transports.Console({ stderrLevels: ['error'] })],
    defaultMeta: { service: 'interview-buddy-api' }
  });
}

const logger = createLogger();

module.exports = logger;
