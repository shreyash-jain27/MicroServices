import { createClient } from 'redis';
import { logger } from '@service-hub/common';

/**
 * Redis Singleton Client
 * 
 * PURPOSE: Provides a single, shared instance of the Redis client.
 * STRUCTURE: Exports the client and a connection function.
 * BEST PRACTICE: Uses event listeners to log connectivity issues immediately.
 */

let redisClient;

const getRedisClient = () => {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
    
    redisClient = createClient({
      url: redisUrl,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (err) => logger.error('❌ Redis Client Error', err));
    redisClient.on('connect', () => logger.info('✅ Redis Connected'));
    redisClient.on('end', () => logger.warn('⚠️ Redis Connection Ended'));
  }
  return redisClient;
};

export const connectRedis = async () => {
  const client = getRedisClient();
  if (!client.isOpen) {
    await client.connect();
  }
};

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis connection closed.');
  }
};

export const client = getRedisClient();
