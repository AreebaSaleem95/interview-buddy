require('dotenv').config();

const http = require('http');
const logger = require('./config/logger');
const { getConfig } = require('./config/env');
const { connectDB, disconnectDB } = require('./config/database');

const config = getConfig();
const app = require('./app');

const PORT = config.port;
const SHUTDOWN_TIMEOUT_MS = config.shutdownTimeoutMs;

const server = http.createServer(app);

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);

  server.close(async () => {
    try {
      await disconnectDB();
      logger.info('HTTP server and database connections closed');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown', { message: err.message });
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
};

const startServer = async () => {
  try {
    await connectDB();

    const { seedQuestionsCollection } = require('./utils/runSeedQuestions');
    await seedQuestionsCollection();

    server.listen(PORT, () => {
      logger.info('Server listening', {
        port: PORT,
        environment: config.nodeEnv,
        clientUrls: config.clientUrls
      });
    });

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', { message: error.message });
    process.exit(1);
  }
};

startServer();
