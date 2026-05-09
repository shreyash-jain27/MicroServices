import * as messageService from '../../services/message.service.js';
import { logger } from '@service-hub/common';
import { pubClient as redisPub } from '../../config/redis.js';
import Room from '../../models/Room.model.js';

export const onSendMessage = (io, socket) => {
  socket.on('send-message', async ({ roomId, content, type }) => {
    try {
      const userId = socket.user.id;
      const senderName = socket.user.name || 'User'; 

      const message = await messageService.createMessage(roomId, userId, senderName, content, type);

      
      io.to(roomId).emit('new-message', { roomId, message });

      
      const room = await Room.findById(roomId);
      if (room) {
        await redisPub.publish('CHAT:NEW_MESSAGE', JSON.stringify({
          roomId,
          roomName: room.name,
          senderId: userId,
          senderName,
          content,
          recipients: room.participants.filter(p => p.toString() !== userId.toString())
        }));
      }
      
    } catch (error) {
      logger.error('Socket send-message error:', error.message);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('typing', ({ roomId, userName }) => {
    socket.to(roomId).emit('user-typing', { roomId, userId: socket.user.id, userName });
  });

  socket.on('stop-typing', ({ roomId }) => {
    socket.to(roomId).emit('user-stopped-typing', { roomId, userId: socket.user.id });
  });
};
