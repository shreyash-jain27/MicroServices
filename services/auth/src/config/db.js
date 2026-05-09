import mongoose from 'mongoose';
import { logger } from '@service-hub/common';



let retryCount = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
    const conn = await mongoose.connect(mongoUri);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    retryCount = 0; 
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
