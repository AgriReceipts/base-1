import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {csrfSync} from 'csrf-sync'; // Import csrf-sync
import {Request} from 'express';
import receiptRoutes from './routes/receipts';
import authRoutes from './routes/auth';
import metaDataRoutes from './routes/metadata';
import analyticsRoutes from './routes/analytics';
import {swaggerDocs} from './utils/swagger';
import targetRoutes from './routes/target';
import reportRoutes from './routes/report';
import redis from './utils/redis';
import session from 'express-session';
import RedisStore from 'connect-redis';

// Load environment variables
dotenv.config();

const app = express();

// Initialize RedisStore with session
const RedisStoreConstructor = RedisStore(session);
const redisStore = new RedisStoreConstructor({
  client: redis,
  prefix: 'session:',
});

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'], // Allow the CSRF token header
  })
);

// Logging
app.use(morgan('dev'));
// Body parsing middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

// Cookie parser MUST be before CSRF middleware
app.use(cookieParser());

app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || 'your-super-secret-key', // Use an env variable
    resave: false,
    saveUninitialized: false, // Don't create sessions for unauthenticated users
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevents client-side JS from reading the cookie
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize CSRF protection
const {csrfSynchronisedProtection, generateToken} = csrfSync({
  // Method to get the token from the request
  getTokenFromRequest: (req: Request) => {
    const token = req.headers['x-csrf-token'];
    // Express headers can be a string, an array of strings, or undefined.
    // We handle the array case by taking the first element.
    if (Array.isArray(token)) {
      return token[0];
    }
    return token;
  },
});

//swaggerHub
swaggerDocs(app);

// Health check endpoint - MODIFIED
// This route is unprotected and used by the frontend to get the initial CSRF token
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    csrfToken: generateToken(req), // Generate and send the token
  });
});

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 600 * 1000, // 10 minute
  max: 100,
  message: 'Too many login attempts. Please try again in a minute.',
  handler: (req, res) => {
    console.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many login attempts. Please try again later.',
    });
  },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // Higher limit for general API
  message: 'Too many requests. Please slow down.',
  handler: (req, res) => {
    console.warn(`General rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later.',
    });
  },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/receipts/createReceipt', authLimiter);
app.use('/api', generalLimiter);

// CSRF protection middleware is applied AFTER the health check and BEFORE your state-changing routes
app.use(csrfSynchronisedProtection);

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
    // Check for CSRF error
    if (err.code === 'EBADCSRFTOKEN') {
      console.warn(`CSRF token validation failed for IP: ${req.ip}`);
      res.status(403).json({
        success: false,
        error: 'CSRF token is invalid or missing.',
      });
    } else {
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
  }
);

export default app;
