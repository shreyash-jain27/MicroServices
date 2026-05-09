

const services = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    timeout: 10000, 
  },
  chat: {
    url: process.env.CHAT_SERVICE_URL || 'http://localhost:3002',
    timeout: 30000, 
  },
  notification: {
    url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003',
    timeout: 5000,
  }
};

export default services;
