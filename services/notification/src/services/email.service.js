import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import { logger } from '@service-hub/common';
import { initEmail, getTransporter } from '../config/email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));



const transporter = initEmail();

export const loadTemplate = async (templateName, data) => {
  const filePath = path.join(__dirname, '../templates/email', `${templateName}.html`);
  const source = await fs.readFile(filePath, 'utf-8');
  const template = handlebars.compile(source);
  return template({ ...data, appUrl: process.env.APP_URL });
};

export const sendEmail = async (to, subject, html) => {
  const from = process.env.EMAIL_FROM || 'noreply@servicehub.com';

  if (process.env.EMAIL_PROVIDER === 'sendgrid') {
    await transporter.send({ to, from, subject, html });
  } else {
    await transporter.sendMail({ from, to, subject, html });
  }
};
