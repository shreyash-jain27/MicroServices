import express from 'express';
import authGateway from './auth.gateway.js';
import chatGateway from './chat.gateway.js';
import notificationGateway from './notification.gateway.js';
import { ApiError } from '@service-hub/common';

const router = express.Router();




router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'api-gateway',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});


router.use('/auth', authGateway);
router.use('/chat', chatGateway);
router.use('/notifications', notificationGateway);


router.all('*', (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found on this gateway`));
});

export default router;
