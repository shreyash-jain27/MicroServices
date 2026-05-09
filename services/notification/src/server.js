import dotenv from 'dotenv';
import app from './app.js';
import { initWorkers, closeWorkers } from './jobs/index.js';
import { connection as redisClient } from './config/redis.js';
import * as notificationService from './services/notification.service.js';
import { logger } from '@service-hub/common';

dotenv.config();

const PORT = process.env.PORT || 3003;
const isWorkerMode = process.argv.includes('--worker');

const startServer = async () => {
  try {
    if (isWorkerMode) {
      
      initWorkers();
      logger.info('👷 Running in WORKER mode');
    } else {
      
      app.listen(PORT, () => logger.info(`🚀 Notification API running on port ${PORT}`));

      
      if (process.env.NODE_ENV === 'development') {
        initWorkers();
        logger.info('👷 Running Workers in same process (development)');
      }

      
      const subscriber = redisClient.duplicate();
      
      subscriber.on('message', (channel, message) => {
        try {
          const data = JSON.parse(message);
          
          if (channel === 'CHAT:NEW_MESSAGE') {
            logger.info(`🔔 Received Pub/Sub: New message in ${data.roomName}`);
            data.recipients.forEach(userId => {
              notificationService.sendNewMessageNotification(
                'user@example.com', 
                'User',
                data.senderName,
                data.roomName,
                data.content,
                data.roomId
              );
            });
          }
          
          if (channel === 'AUTH:USER_REGISTERED') {
            logger.info(`🔔 Received Pub/Sub: New user registered - ${data.email}`);
            notificationService.sendWelcomeEmail(data.userId, data.name, data.email);
          }
        } catch (err) {
          logger.error(`❌ Pub/Sub processing error on channel ${channel}:`, err.message);
        }
      });

      await subscriber.subscribe('CHAT:NEW_MESSAGE', 'AUTH:USER_REGISTERED');
      
      logger.info('📡 Subscribed to Cross-Service events');
    }
  } catch (error) {
    logger.error('❌ Failed to start Notification Service:', error);
    process.exit(1);
  }
};

const shutdown = async () => {
  logger.info('Shutting down...');
  await closeWorkers();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
