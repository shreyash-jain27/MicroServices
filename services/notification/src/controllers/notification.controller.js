import * as notificationService from '../services/notification.service.js';
import { emailQueue } from '../config/queue.js';



export const sendTestEmail = async (req, res, next) => {
  try {
    const { email, userName } = req.body;
    const jobId = await notificationService.sendWelcomeEmail('test-id', userName, email);
    res.json({ success: true, jobId });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const counts = await emailQueue.getJobCounts();
    res.json({ success: true, data: counts });
  } catch (error) {
    next(error);
  }
};
