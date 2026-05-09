import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorConverter, errorHandler } from '@service-hub/common';
import authRoutes from './routes/auth.routes.js';



const app = express();


app.use(helmet());


app.use(express.json());


app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));


app.use('/auth', authRoutes);


app.use(errorConverter);
app.use(errorHandler);

export default app;
