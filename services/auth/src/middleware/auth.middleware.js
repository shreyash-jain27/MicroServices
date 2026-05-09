import { verifyAccessToken } from '../utils/jwt.utils.js';
import { ApiError } from '@service-hub/common';
import User from '../models/User.model.js';


export const authenticate = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Please authenticate: Missing token');
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new ApiError(401, 'Invalid or expired token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
