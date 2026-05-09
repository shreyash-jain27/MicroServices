import { logger } from '@service-hub/common';


export default async (job) => {
  logger.info(`📱 Processing push notification job ${job.id}`);
  
  return { status: 'success', note: 'push not implemented' };
};
