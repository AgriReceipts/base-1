import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import receiptRoutes from './routes/receipts';
import authRoutes from './routes/auth';
import metaDataRoutes from './routes/metadata';
import analyticsRoutes from './routes/analytics';
import {swaggerDocs} from './utils/swagger';
import targetRoutes from './routes/target';
import reportRoutes from './routes/report';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Logging
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

//swaggerHub
swaggerDocs(app);

// 👇 Stricter limiter for auth
const authLimiter = rateLimit({
  windowMs: 900 * 1000, // 15 minute
  max: 10,
  message: 'Too many login attempts. Please try again in a minute.',
  handler: (req, res) => {
    console.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many login attempts. Please try again later.',
    });
  },
});

// 👇 General limiter for other API routes
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Higher limit for general API
  message: 'Too many requests. Please slow down.',
  handler: (req, res) => {
    console.warn(`General rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later.',
    });
  },
});

app.use('/api/auth', authLimiter);
app.use('/api/receipts/createReceipt', authLimiter);
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/metaData', metaDataRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({error: 'Route not found'});
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
      success: false,
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
      ...(process.env.NODE_ENV !== 'production' && {stack: err.stack}),
    });
  }
);

export default app;
