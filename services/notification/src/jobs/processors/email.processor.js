import { logger } from '@service-hub/common';
import * as emailService from '../../services/email.service.js';


export default async (job) => {
  const { to, subject, template, data } = job.data;
  
  try {
    logger.info(`📧 Processing email job ${job.id} for ${to}`);
    
    
    const html = await emailService.loadTemplate(template, data);
    
    
    await emailService.sendEmail(to, subject, html);
    
    return { status: 'success' };
  } catch (error) {
    logger.error(`❌ Email processing failed for job ${job.id}: ${error.message}`);
    throw error; 
  }
};
