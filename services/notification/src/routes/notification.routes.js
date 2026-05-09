import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();



router.post('/test-email', notificationController.sendTestEmail);
router.get('/stats', notificationController.getStats);

export default router;
