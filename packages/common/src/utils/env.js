import { z } from 'zod';
import logger from './logger.js';


export const validateEnv = (schema) => {
  try {
    return schema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join('.')).join(', ');
      logger.error(`❌ Invalid environment variables: ${missingVars}`);
      process.exit(1); 
    }
    throw error;
  }
};
