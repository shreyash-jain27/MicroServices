import { logger } from '@service-hub/common';


export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const userId = req.user ? req.user.id : 'anonymous';
    
    logger.info(`[GATEWAY] ${method} ${url} | ${res.statusCode} | ${duration}ms | IP: ${ip} | User: ${userId}`);
  });

  next();
};
