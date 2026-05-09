import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as validateMiddleware from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();



router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'auth-service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.post('/register', validateMiddleware.validateRegister, authController.register);
router.post('/login', validateMiddleware.validateLogin, authController.login);
router.post('/refresh', validateMiddleware.validateRefresh, authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
