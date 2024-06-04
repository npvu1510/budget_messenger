import express from 'express';
import path from 'path';

import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRouter.js';

const app = express();

// PARSER MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// LOG MIDDEWARES
app.use(morgan('dev'));

// STATIC
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/messages', messageRouter);

export default app;
