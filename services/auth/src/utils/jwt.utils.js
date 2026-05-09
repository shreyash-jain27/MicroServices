import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { client as redisClient } from '../config/redis.js';
import { logger } from '@service-hub/common';



export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
};

export const generateRefreshToken = (userId) => {
  const tokenId = crypto.randomBytes(16).toString('hex');
  const token = jwt.sign({ id: userId, tokenId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
  return { token, tokenId };
};

export const generateTokenPair = (userId) => {
  const accessToken = generateAccessToken(userId);
  const { token: refreshToken, tokenId } = generateRefreshToken(userId);
  return { accessToken, refreshToken, tokenId };
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

export const storeRefreshToken = async (userId, token, tokenId) => {
  const key = `refresh_token:${userId}:${tokenId}`;
  const expiry = 7 * 24 * 60 * 60; 
  await redisClient.set(key, token, { EX: expiry });
};

export const verifyRefreshTokenInRedis = async (userId, tokenId) => {
  const key = `refresh_token:${userId}:${tokenId}`;
  const token = await redisClient.get(key);
  return !!token;
};

export const deleteRefreshToken = async (userId, tokenId) => {
  const key = `refresh_token:${userId}:${tokenId}`;
  await redisClient.del(key);
};

export const deleteAllRefreshTokens = async (userId) => {
  const pattern = `refresh_token:${userId}:*`;
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};
