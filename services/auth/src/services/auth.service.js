import User from '../models/User.model.js';
import { ApiError } from '@service-hub/common';
import * as jwtUtils from '../utils/jwt.utils.js';
import { client as redisClient } from '../config/redis.js';



export const register = async (name, email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({ name, email, password });
  const { accessToken, refreshToken, tokenId } = jwtUtils.generateTokenPair(user._id);
  
  await jwtUtils.storeRefreshToken(user._id, refreshToken, tokenId);

  
  try {
    await redisClient.publish('AUTH:USER_REGISTERED', JSON.stringify({
      userId: user._id,
      email: user.email,
      name: user.name,
      timestamp: new Date().toISOString()
    }));
  } catch (err) {
    
    console.error('Failed to publish AUTH:USER_REGISTERED event:', err);
  }

  return { user, tokens: { accessToken, refreshToken } };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken, tokenId } = jwtUtils.generateTokenPair(user._id);
  await jwtUtils.storeRefreshToken(user._id, refreshToken, tokenId);

  return { user, tokens: { accessToken, refreshToken } };
};

export const refreshTokens = async (oldRefreshToken) => {
  const decoded = jwtUtils.verifyRefreshToken(oldRefreshToken);
  if (!decoded) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const tokenExists = await jwtUtils.verifyRefreshTokenInRedis(decoded.id, decoded.tokenId);
  if (!tokenExists) {
    throw new ApiError(401, 'Session expired or invalid');
  }

  
  await jwtUtils.deleteRefreshToken(decoded.id, decoded.tokenId);

  const { accessToken, refreshToken, tokenId } = jwtUtils.generateTokenPair(decoded.id);
  await jwtUtils.storeRefreshToken(decoded.id, refreshToken, tokenId);

  return { accessToken, refreshToken };
};

export const logout = async (userId, refreshToken) => {
  const decoded = jwtUtils.verifyRefreshToken(refreshToken);
  if (decoded && decoded.id === userId.toString()) {
    await jwtUtils.deleteRefreshToken(userId, decoded.tokenId);
  }
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};
