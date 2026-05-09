import * as messageService from '../services/message.service.js';
import * as roomService from '../services/room.service.js';

export const getMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { page, limit } = req.query;
    const userId = req.headers['x-user-id']; 

    const data = await messageService.getMessagesByRoom(roomId, userId, parseInt(page), parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const rooms = await roomService.getRoomsByUser(userId);
    res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const { name, type, participants } = req.body;
    const userId = req.headers['x-user-id'];
    const room = await roomService.createRoom(name, type, userId, participants);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};
