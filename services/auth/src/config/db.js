import mongoose from 'mongoose';
import { logger } from '@service-hub/common';

/**
 * MongoDB Connection with Retry Logic
 * 
 * PURPOSE: Manages the connection to MongoDB.
 * STRUCTURE: Uses a recursive function for retries.
 * CONNECTS TO: Used by server.js to initialize the DB.
 * BEST PRACTICE: Implements exponential backoff (fixed 5s here) and event listeners 
 * for 'error' and 'disconnected' to maintain system health.
 */

let retryCount = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
    const conn = await mongoose.connect(mongoUri);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    retryCount = 0; // Reset on success
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      logger.info(`Retrying connection (${retryCount}/${MAX_RETRIES}) in 5 seconds...`);
      setTimeout(connectDB, 5000);
    } else {
      logger.error('❌ Max MongoDB retries reached. Exiting...');
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
  connectDB();
});

mongoose.connection.on('error', (err) => {
  logger.error(`❌ MongoDB Error: ${err.message}`);
});

export const disconnectDB = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed.');
};

export default connectDB;
