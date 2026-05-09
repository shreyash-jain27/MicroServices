import express from 'express';
import { setupProxy } from '../utils/proxy.utils.js';
import services from '../config/services.config.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import { verifyJWT } from '../middleware/jwtVerify.middleware.js';

const router = express.Router();




router.post('/register', authLimiter, setupProxy(services.auth.url));
router.post('/login', authLimiter, setupProxy(services.auth.url));
router.post('/refresh', setupProxy(services.auth.url));


router.post('/logout', verifyJWT, setupProxy(services.auth.url));
router.get('/me', verifyJWT, setupProxy(services.auth.url));

export default router;
