/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import routeNotFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();
app.use(express.json());
app.use(cors({ origin: ['/http://localhost:5173'] }));
app.use(cookieParser());

// const test = async (req: Request, res: Response) => {
//   Promise.reject();
// };

// app.get('/', test);

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Developer 👋!');
});

app.use(globalErrorHandler);
app.use(routeNotFound);

export default app;
