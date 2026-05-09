import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import { errorConverter, errorHandler } from '@service-hub/common';
import chatRoutes from './routes/chat.routes.js';
import { initSocket } from './socket/index.js';

const app = express();
const httpServer = createServer(app);


app.use(helmet());
app.use(cors());
app.use(express.json());


app.use('/chat', chatRoutes);


const io = initSocket(httpServer);


app.use(errorConverter);
app.use(errorHandler);

export { app, httpServer, io };
