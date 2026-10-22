require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./logger');
const mongoose = require('mongoose');

// Start server after DB connection
(async () => {
  try {
    for (const name of ['MONGODB_URI', 'JWT_SECRET', 'GOOGLE_GENAI_API_KEY']) {
      if (!process.env[name]) {
        throw new Error(`${name} is required`);
      }
    }
    if (process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith('replace_with_')) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }

    await connectDB();
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });

    // Graceful shutdown
    let isShuttingDown = false;
    const shutdown = (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;
      logger.info(`Received ${signal}; shutting down server...`);
      server.close(async (error) => {
        try {
          await mongoose.disconnect();
          if (error) throw error;
          logger.info('HTTP server and database connections closed');
          process.exitCode = 0;
        } catch (shutdownError) {
          logger.error(`Shutdown failed: ${shutdownError.message}`);
          process.exitCode = 1;
        }
      });
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
})();


