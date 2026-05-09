import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '../config/redis.js';
import { socketAuth } from '../middleware/socketAuth.middleware.js';
import * as connectionHandler from './handlers/connection.handler.js';
import * as messageHandler from './handlers/message.handler.js';


export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
  });

  
  io.adapter(createAdapter(pubClient, subClient));

  
  io.use(socketAuth);

  
  io.on('connection', (socket) => {
    connectionHandler.onConnection(io, socket);
    messageHandler.onSendMessage(io, socket);
  });

  return io;
};
