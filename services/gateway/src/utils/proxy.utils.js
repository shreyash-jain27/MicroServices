import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger, ApiError } from '@service-hub/common';


export const setupProxy = (target, pathRewrite) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true, 
    pathRewrite,
    proxyTimeout: 10000, 
    onProxyReq: (proxyReq, req, res) => {
      
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id);
      }
      logger.info(`[PROXY] Forwarding ${req.method} ${req.url} -> ${target}`);
    },
    onError: (err, req, res) => {
      logger.error(`[PROXY] Error forwarding to ${target}: ${err.message}`);
      
      res.status(503).json({
        code: 503,
        message: 'Service Temporarily Unavailable',
      });
    },
  });
};
