import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'; // Prisma client

import userRouter from './routes/userRoutes';
import eventRouter from './routes/eventRoutes';
import addressRouter from './routes/addressRoutes';
import adminRouter from './routes/adminRoutes';


export const app = express();
const prisma = new PrismaClient(); // Creates a new Prisma client instanc


app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}
));
app.use(compression());
app.use(cookieParser());


// API Routes
app.use('/auth', userRouter);
app.use('/events', eventRouter);
app.use('/locations', addressRouter);
app.use('/admin', adminRouter);
 

// Catch unregistered routes
app.all('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Example route
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

// Clean up Prisma connection on app termination
process.on('SIGINT', async () => {
  console.log('Closing Prisma connection...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;