import { emailQueue } from '../config/queue.js';
import { logger } from '@service-hub/common';



export const sendWelcomeEmail = async (userId, userName, userEmail) => {
  const job = await emailQueue.add('welcome-email', {
    to: userEmail,
    subject: `Welcome to Service Hub, ${userName}!`,
    template: 'welcome',
    data: { userName }
  });
  logger.info(`📝 Queued welcome email: Job ID ${job.id}`);
  return job.id;
};

export const sendNewMessageNotification = async (userEmail, userName, senderName, roomName, messagePreview, roomId) => {
  const job = await emailQueue.add('new-message', {
    to: userEmail,
    subject: `New message from ${senderName}`,
    template: 'newMessage',
    data: { userName, senderName, roomName, messagePreview, roomId }
  });
  logger.info(`📝 Queued message notification: Job ID ${job.id}`);
  return job.id;
};
