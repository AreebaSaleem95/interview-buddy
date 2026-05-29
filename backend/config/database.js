const mongoose = require('mongoose');
const logger = require('./logger');
const { getConfig } = require('./env');

const connectDB = async () => {
  try {
    const config = getConfig();
    const mongoURI = config.mongoUri;

    const options = {
      maxPoolSize: config.mongoMaxPoolSize,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: !config.isProduction
    };

    const conn = await mongoose.connect(mongoURI, options);

    logger.info('MongoDB connected', {
      host: conn.connection.host,
      name: conn.connection.name
    });

    return conn;
  } catch (error) {
    logger.error('MongoDB connection error', { message: error.message, name: error.name });
    if (error.name === 'MongoServerError') {
      logger.error('MongoServerError details', { code: error.code });
    }
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.connection.close();
  logger.info('Mongoose connection closed');
};

mongoose.connection.on('connected', () => {
  logger.debug('Mongoose connected event');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error', { message: err.message });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected');
});

module.exports = {
  connectDB,
  disconnectDB
};
