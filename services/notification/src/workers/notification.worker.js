import { Worker } from 'bullmq';
import { redisConnection } from '../config/queue.js';
import { sendEmail } from '../utils/email.utils.js';
import { logger } from '@service-hub/common';


export const initWorker = () => {
  const worker = new Worker('notifications', async (job) => {
    const { type, data } = job.data;
    
    logger.info(`🔄 Processing job ${job.id} [${type}]`);

    switch (type) {
      case 'WELCOME_EMAIL':
        await sendEmail(
          data.email, 
          'Welcome to Service Hub!', 
          `<h1>Hello ${data.name}</h1><p>Thanks for joining us!</p>`
        );
        break;
        
      case 'CHAT_NOTIFICATION':
        await sendEmail(
          data.email, 
          'New Message Received', 
          `<p>You have a new message from <b>${data.senderName}</b></p><p>${data.content}</p>`
        );
        break;

      default:
        logger.warn(`⚠️ Unknown job type: ${type}`);
    }
  }, { 
    connection: redisConnection,
    concurrency: 5, 
  });

  worker.on('completed', (job) => {
    logger.info(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`❌ Job ${job.id} failed: ${err.message}`);
  });

  return worker;
};
