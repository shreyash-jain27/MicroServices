import { logger } from '@service-hub/common';
import * as roomService from '../../services/room.service.js';


export const onConnection = async (io, socket) => {
  const userId = socket.user.id;
  logger.info(`🔌 User ${userId} connected to socket ${socket.id}`);

  
  const rooms = await roomService.getRoomsByUser(userId);
  rooms.forEach(room => {
    socket.join(room._id.toString());
  });

  socket.emit('connected', { userId, socketId: socket.id });

  socket.on('disconnect', () => {
    logger.info(`🔌 User ${userId} disconnected`);
  });
};
