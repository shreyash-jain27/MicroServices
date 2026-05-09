import { Queue } from 'bullmq';
import { connection } from './redis.js';



const defaultOptions = {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
  },
};

export const emailQueue = new Queue('emailQueue', { connection, ...defaultOptions });
export const pushQueue = new Queue('pushQueue', { connection, ...defaultOptions });
