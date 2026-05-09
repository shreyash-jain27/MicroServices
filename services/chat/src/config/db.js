import mongoose from 'mongoose';
import { logger } from '@service-hub/common';


let retryCount = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
    const conn = await mongoose.connect(mongoUri);
    logger.info(`✅ Chat MongoDB Connected: ${conn.connection.host}`);
    retryCount = 0;
  } catch (error) {
    logger.error(`❌ Chat MongoDB Connection Error: ${error.message}`);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};

export default connectDB;
