import { createClient } from 'redis';
import { logger } from '@service-hub/common';

/**
 * Redis Pub/Sub Configuration
 * 
 * WHY: Redis requires separate clients for publishing and subscribing.
 */

const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

const redisConfig = {
  url: redisUrl,
  password: process.env.REDIS_PASSWORD || undefined,
};

export const pubClient = createClient(redisConfig);
export const subClient = pubClient.duplicate();

pubClient.on('error', (err) => logger.error('❌ Redis Pub Error', err));
subClient.on('error', (err) => logger.error('❌ Redis Sub Error', err));

export const connectRedis = async () => {
  await Promise.all([pubClient.connect(), subClient.connect()]);
  logger.info('✅ Chat Redis Pub/Sub Connected');
};

export const disconnectRedis = async () => {
  await Promise.all([pubClient.quit(), subClient.quit()]);
};
