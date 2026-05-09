import rateLimit from 'express-rate-limit';
import { ApiError } from '@service-hub/common';



export const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many requests, please try again later'));
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many login attempts, please try again in 15 minutes'));
  },
});
