import express from 'express';
import authGateway from './auth.gateway.js';
import chatGateway from './chat.gateway.js';
import notificationGateway from './notification.gateway.js';
import { ApiError } from '@service-hub/common';

const router = express.Router();


router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Hub | Microservices Ecosystem</title>
        <style>
            :root {
                --primary: #6366f1;
                --bg: #0f172a;
                --card-bg: #1e293b;
                --text: #f1f5f9;
                --text-muted: #94a3b8;
                --success: #22c55e;
            }
            body {
                font-family: 'Inter', -apple-system, sans-serif;
                background-color: var(--bg);
                color: var(--text);
                line-height: 1.6;
                margin: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                padding: 2rem;
            }
            .container {
                max-width: 1000px;
                width: 100%;
            }
            header {
                text-align: center;
                margin-bottom: 4rem;
            }
            h1 {
                font-size: 3rem;
                margin-bottom: 0.5rem;
                background: linear-gradient(to right, #818cf8, #c084fc);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle {
                color: var(--text-muted);
                font-size: 1.2rem;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-bottom: 4rem;
            }
            .card {
                background: var(--card-bg);
                padding: 2rem;
                border-radius: 1rem;
                border: 1px solid #334155;
                transition: transform 0.2s, border-color 0.2s;
            }
            .card:hover {
                transform: translateY(-5px);
                border-color: var(--primary);
            }
            .card h2 {
                margin-top: 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .status {
                width: 10px;
                height: 10px;
                background: var(--success);
                border-radius: 50%;
                display: inline-block;
            }
            .platform {
                font-size: 0.8rem;
                background: #334155;
                padding: 0.2rem 0.6rem;
                border-radius: 1rem;
                color: var(--text-muted);
                float: right;
            }
            .tech-stack {
                margin-top: 4rem;
                text-align: center;
            }
            .tech-tags {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 0.75rem;
                margin-top: 1rem;
            }
            .tag {
                background: #312e81;
                color: #e0e7ff;
                padding: 0.4rem 1rem;
                border-radius: 2rem;
                font-size: 0.9rem;
                font-weight: 500;
            }
            footer {
                margin-top: auto;
                color: var(--text-muted);
                font-size: 0.9rem;
                padding: 2rem 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>Service Hub</h1>
                <p class="subtitle">A Modern Node.js Microservices Ecosystem</p>
            </header>

            <div class="grid">
                <div class="card">
                    <span class="platform">Railway</span>
                    <h2><span class="status"></span> API Gateway</h2>
                    <p>Unified entry point for the entire ecosystem. Handles routing, rate limiting, and JWT verification.</p>
                    <ul>
                        <li>Centralized Auth Proxy</li>
                        <li>Request Logging</li>
                        <li>Security Headers</li>
                    </ul>
                </div>

                <div class="card">
                    <span class="platform">Railway</span>
                    <h2><span class="status"></span> Auth Service</h2>
                    <p>Identity provider managing users and sessions with high security standards.</p>
                    <ul>
                        <li>JWT Access & Refresh Tokens</li>
                        <li>Redis Session Storage</li>
                        <li>Bcrypt Hashing</li>
                    </ul>
                </div>

                <div class="card">
                    <span class="platform">Render</span>
                    <h2><span class="status"></span> Chat Service</h2>
                    <p>Real-time communication hub powered by WebSockets for instant messaging.</p>
                    <ul>
                        <li>Socket.io Integration</li>
                        <li>Message Persistence (MongoDB)</li>
                        <li>Redis Pub/Sub Scaling</li>
                    </ul>
                </div>

                <div class="card">
                    <span class="platform">Railway</span>
                    <h2><span class="status"></span> Notification Service</h2>
                    <p>Asynchronous worker service handling all system-wide communication.</p>
                    <ul>
                        <li>BullMQ Background Jobs</li>
                        <li>SMTP Email Integration</li>
                        <li>Cross-Service Event Listening</li>
                    </ul>
                </div>
            </div>

            <div class="tech-stack">
                <h3>Built With Best-in-Class Technology</h3>
                <div class="tech-tags">
                    <span class="tag">Node.js 20</span>
                    <span class="tag">Express</span>
                    <span class="tag">MongoDB</span>
                    <span class="tag">Redis</span>
                    <span class="tag">Docker</span>
                    <span class="tag">Socket.io</span>
                    <span class="tag">BullMQ</span>
                    <span class="tag">Zod</span>
                    <span class="tag">npm Workspaces</span>
                </div>
            </div>

            <footer style="text-align: center;">
                <p>Architecture: Monorepo Deployment &bull; 2026 Production Ready</p>
            </header>
        </div>
    </body>
    </html>
  `);
});


router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'api-gateway',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});


router.use('/auth', authGateway);
router.use('/chat', chatGateway);
router.use('/notifications', notificationGateway);


router.all('*', (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found on this gateway`));
});

export default router;
