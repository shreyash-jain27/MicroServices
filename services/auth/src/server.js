import dotenv from 'dotenv';
import { z } from 'zod';
import app from './app.js';
import connectDB, { disconnectDB } from './config/db.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { logger, validateEnv } from '@service-hub/common';

dotenv.config();


const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().url(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
});

validateEnv(envSchema);

const PORT = process.env.PORT || 3001;
let server;

const startServer = async () => {
  try {
    
    await connectDB();
    await connectRedis();

    
    server = app.listen(PORT, () => {
      logger.info(`🚀 Auth Service is running on port ${PORT}`);
    });

  } catch (error) {
    logger.error('❌ Failed to start Auth Service:', error);
    process.exit(1);
  }
};


const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      
      try {
        await disconnectDB();
        await disconnectRedis();
        logger.info('Graceful shutdown complete. Exiting.');
        process.exit(0);
      } catch (err) {
        logger.error('Error during shutdown:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
