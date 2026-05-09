import { Worker } from 'bullmq';
import { connection } from '../config/redis.js';
import { logger } from '@service-hub/common';
import emailProcessor from './processors/email.processor.js';
import pushProcessor from './processors/push.processor.js';



let emailWorker;
let pushWorker;

export const initWorkers = () => {
  emailWorker = new Worker('emailQueue', emailProcessor, { 
    connection,
    concurrency: 5 
  });

  pushWorker = new Worker('pushQueue', pushProcessor, { 
    connection,
    concurrency: 5 
  });

  
  emailWorker.on('completed', (job) => logger.info(`✅ Email Job ${job.id} completed`));
  emailWorker.on('failed', (job, err) => logger.error(`❌ Email Job ${job.id} failed: ${err.message}`));

  logger.info('👷 Notification Workers Initialized');
};

export const closeWorkers = async () => {
  if (emailWorker) await emailWorker.close();
  if (pushWorker) await pushWorker.close();
};
