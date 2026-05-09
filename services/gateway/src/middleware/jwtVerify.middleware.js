import jwt from 'jsonwebtoken';
import { ApiError } from '@service-hub/common';


export const verifyJWT = (req, res, next) => {
  
  const publicPaths = ['/auth/register', '/auth/login', '/auth/refresh'];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authorization token required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    let message = 'Invalid token';
    if (error.name === 'TokenExpiredError') message = 'Token expired';
    
    return next(new ApiError(401, message));
  }
};
