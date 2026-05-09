import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorConverter, errorHandler } from '@service-hub/common';
import notificationRoutes from './routes/notification.routes.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());


app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'notification-service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});


app.use('/notifications', notificationRoutes);

app.use(errorConverter);
app.use(errorHandler);

export default app;
