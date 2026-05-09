import nodemailer from 'nodemailer';
import { logger } from '@service-hub/common';



const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Service Hub" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    logger.info(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`❌ Email send failed: ${error.message}`);
    throw error; 
  }
};
