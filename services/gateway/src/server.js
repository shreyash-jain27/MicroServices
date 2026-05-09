import dotenv from 'dotenv';
import { z } from 'zod';
import app from './app.js';
import { logger, validateEnv } from '@service-hub/common';
import services from './config/services.config.js';

dotenv.config();


const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_ACCESS_SECRET: z.string().min(32),
  AUTH_SERVICE_URL: z.string().url(),
  CHAT_SERVICE_URL: z.string().url().optional(),
  NOTIFICATION_SERVICE_URL: z.string().url().optional(),
});

validateEnv(envSchema);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info('----------------------------------------------');
  logger.info(`🚀 API Gateway running on port ${PORT}`);
  logger.info(`🔗 Auth Service: ${services.auth.url}`);
  logger.info('----------------------------------------------');
});


const shutdown = () => {
  logger.info('Gracefully shutting down API Gateway...');
  server.close(() => {
    logger.info('API Gateway closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
