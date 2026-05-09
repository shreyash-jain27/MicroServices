import express from 'express';
import * as chatController from '../controllers/chat.controller.js';

const router = express.Router();



router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'chat-service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.get('/rooms', chatController.getRooms);
router.post('/rooms', chatController.createRoom);
router.get('/rooms/:roomId/messages', chatController.getMessages);

export default router;
