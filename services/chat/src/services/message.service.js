import Message from '../models/Message.model.js';
import Room from '../models/Room.model.js';
import * as roomService from './room.service.js';

export const createMessage = async (roomId, senderId, senderName, content, type = 'text') => {
  
  await roomService.validateParticipant(roomId, senderId);

  const message = await Message.create({
    roomId,
    senderId,
    senderName,
    content,
    type
  });

  
  await Room.findByIdAndUpdate(roomId, {
    lastMessage: {
      content,
      senderId,
      timestamp: message.createdAt
    }
  });

  return message;
};

export const getMessagesByRoom = async (roomId, userId, page = 1, limit = 50) => {
  await roomService.validateParticipant(roomId, userId);

  const skip = (page - 1) * limit;
  
  const messages = await Message.find({ roomId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Message.countDocuments({ roomId });

  return {
    messages: messages.reverse(), 
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};
