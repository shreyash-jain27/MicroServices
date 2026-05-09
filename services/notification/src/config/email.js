import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { logger } from '@service-hub/common';



let transporter = null;

export const initEmail = () => {
  const provider = process.env.EMAIL_PROVIDER || 'smtp';

  if (provider === 'sendgrid') {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    logger.info('✅ Email Provider: SendGrid');
    return sgMail;
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    logger.info('✅ Email Provider: SMTP');
    return transporter;
  }
};

export const getTransporter = () => transporter;
