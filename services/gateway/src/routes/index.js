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
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #6366f1;
                --primary-glow: rgba(99, 102, 241, 0.4);
                --bg: #030712;
                --card-bg: rgba(30, 41, 59, 0.5);
                --text: #f8fafc;
                --text-muted: #94a3b8;
                --success: #10b981;
                --border: rgba(51, 65, 85, 0.5);
            }
            * { box-sizing: border-box; }
            body {
                font-family: 'Plus Jakarta Sans', sans-serif;
                background-color: var(--bg);
                background-image: 
                    radial-gradient(circle at 50% 0%, #1e1b4b 0%, transparent 50%),
                    radial-gradient(circle at 0% 100%, #0f172a 0%, transparent 50%);
                color: var(--text);
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 4rem 2rem;
            }
            .container { max-width: 1100px; width: 100%; }
            header { text-align: center; margin-bottom: 5rem; }
            h1 {
                font-size: 4rem;
                font-weight: 800;
                margin: 0;
                letter-spacing: -0.05em;
                background: linear-gradient(to bottom right, #fff 30%, #94a3b8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                background: rgba(99, 102, 241, 0.1);
                color: var(--primary);
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.875rem;
                font-weight: 600;
                border: 1px solid rgba(99, 102, 241, 0.2);
                margin-bottom: 1.5rem;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 1.5rem;
            }
            .card {
                background: var(--card-bg);
                backdrop-filter: blur(12px);
                border: 1px solid var(--border);
                border-radius: 1.5rem;
                padding: 2rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                flex-direction: column;
            }
            .card:hover {
                border-color: var(--primary);
                transform: translateY(-8px);
                box-shadow: 0 20px 40px -20px var(--primary-glow);
            }
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 1.5rem;
            }
            .status-wrapper { display: flex; align-items: center; gap: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--success); text-transform: uppercase; font-weight: 700; }
            .dot { width: 8px; height: 8px; background: var(--success); border-radius: 50%; box-shadow: 0 0 12px var(--success); animation: pulse 2s infinite; }
            @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
            .platform-tag { font-size: 0.7rem; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 0.25rem 0.5rem; border-radius: 0.5rem; border: 1px solid var(--border); }
            h2 { margin: 0; font-size: 1.5rem; font-weight: 700; }
            p { color: var(--text-muted); font-size: 0.95rem; margin: 1rem 0 1.5rem; flex-grow: 1; }
            .features { list-style: none; padding: 0; margin: 0 0 2rem; font-size: 0.875rem; color: #cbd5e1; }
            .features li { margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
            .features li::before { content: "→"; color: var(--primary); font-weight: 800; }
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                background: var(--primary);
                color: white;
                text-decoration: none;
                padding: 0.75rem 1rem;
                border-radius: 0.75rem;
                font-weight: 600;
                font-size: 0.875rem;
                transition: filter 0.2s;
            }
            .btn:hover { filter: brightness(1.2); }
            .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
            .btn-outline:hover { background: rgba(255,255,255,0.05); border-color: var(--text-muted); }
            .tech-section { margin-top: 6rem; text-align: center; }
            .tech-stack { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 2rem; }
            .tech-item { font-family: 'JetBrains Mono', monospace; background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.875rem; color: var(--text-muted); }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <span class="badge">SYSTEM ARCHITECTURE V1.0</span>
                <h1>Service Hub</h1>
                <p style="color: var(--text-muted); font-size: 1.25rem; margin-top: 1rem;">Distributed Microservices Ecosystem with Real-time Sync</p>
            </header>

            <div class="grid">
                <div class="card">
                    <div class="card-header">
                        <div class="status-wrapper"><div class="dot"></div>Live</div>
                        <span class="platform-tag">Railway</span>
                    </div>
                    <h2>API Gateway</h2>
                    <p>Centralized entry point using <strong>http-proxy-middleware</strong>. Orchestrates traffic across Railway and Render clusters.</p>
                    <ul class="features">
                        <li>JWT Verification Middleware</li>
                        <li>Global Rate Limiting (Redis)</li>
                        <li>Unified SSL Termination</li>
                    </ul>
                    <a href="/health" target="_blank" class="btn">Test Gateway Endpoint</a>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="status-wrapper"><div class="dot"></div>Live</div>
                        <span class="platform-tag">Railway</span>
                    </div>
                    <h2>Auth Service</h2>
                    <p>Security-first identity service handling persistence via <strong>MongoDB</strong> and sessions via <strong>Redis</strong>.</p>
                    <ul class="features">
                        <li>Dual Token Strategy (Access/Refresh)</li>
                        <li>Zod Environment Validation</li>
                        <li>Bcrypt Password Hashing</li>
                    </ul>
                    <a href="/auth/health" target="_blank" class="btn btn-outline">Verify Auth Status</a>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="status-wrapper"><div class="dot"></div>Live</div>
                        <span class="platform-tag">Render</span>
                    </div>
                    <h2>Chat Service</h2>
                    <p>High-concurrency messaging hub. Leverages <strong>Socket.io</strong> with a Redis adapter for cross-node scaling.</p>
                    <ul class="features">
                        <li>Full Duplex Communication</li>
                        <li>Event-driven Architecture</li>
                        <li>Cross-platform Data Sync</li>
                    </ul>
                    <a href="/chat/health" target="_blank" class="btn btn-outline">Check Render Proxy</a>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="status-wrapper"><div class="dot"></div>Live</div>
                        <span class="platform-tag">Railway</span>
                    </div>
                    <h2>Notification Service</h2>
                    <p>Asynchronous worker pool using <strong>BullMQ</strong>. Processes high-volume mail jobs outside main event loops.</p>
                    <ul class="features">
                        <li>Background Job Processing</li>
                        <li>Redis-backed Task Queues</li>
                        <li>Pub/Sub Event Integration</li>
                    </ul>
                    <a href="/notifications/health" target="_blank" class="btn btn-outline">Test Worker Queue</a>
                </div>
            </div>

            <div class="tech-section">
                <h3 style="font-size: 1.5rem; font-weight: 700;">Infrastructure Stack</h3>
                <div class="tech-stack">
                    <span class="tech-item">Node.js 20</span>
                    <span class="tech-item">Express.js</span>
                    <span class="tech-item">Socket.io</span>
                    <span class="tech-item">MongoDB Cluster</span>
                    <span class="tech-item">Redis (Pub/Sub)</span>
                    <span class="tech-item">BullMQ Workers</span>
                    <span class="tech-item">Docker (Multi-stage)</span>
                    <span class="tech-item">JWT / Bcrypt</span>
                </div>
            </div>

            <footer style="margin-top: 6rem; padding-bottom: 4rem; text-align: center; color: var(--text-muted);">
                <div style="width: 40px; height: 1px; background: var(--border); margin: 0 auto 2rem;"></div>
                <p>Designed for Scalability &bull; Multi-Cloud Architecture &bull; 2026</p>
            </footer>
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
