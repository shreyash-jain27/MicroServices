import IORedis from 'ioredis';
import { logger } from '@service-hub/common';


const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

export const connection = new IORedis(redisUrl, {
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, 
});

connection.on('error', (err) => logger.error('❌ Notification Redis Error:', err));
connection.on('connect', () => logger.info('✅ Notification Redis Connected'));
