import * as authService from '../services/auth.service.js';
import { logger } from '@service-hub/common';



export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { user, tokens } = await authService.register(name, email, password);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, ...tokens }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: { user, ...tokens }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens(refreshToken);
    
    res.status(200).json({
      success: true,
      data: tokens
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(req.user._id, refreshToken);
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
