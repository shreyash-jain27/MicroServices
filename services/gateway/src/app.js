import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorConverter, errorHandler } from '@service-hub/common';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';
import routes from './routes/index.js';



const app = express();


app.use(helmet());


app.use(cors());


app.use(globalLimiter);





app.use(requestLogger);


app.use('/', routes);


app.use(errorConverter);
app.use(errorHandler);

export default app;
