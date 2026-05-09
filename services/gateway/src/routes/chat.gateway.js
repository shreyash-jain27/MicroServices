import express from 'express';
import { setupProxy } from '../utils/proxy.utils.js';
import services from '../config/services.config.js';
import { verifyJWT } from '../middleware/jwtVerify.middleware.js';

const router = express.Router();




router.use(verifyJWT);


router.all('*', setupProxy(services.chat.url));

export default router;
