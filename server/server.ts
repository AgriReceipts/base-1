import app from './src/app';
import dotenv from 'dotenv';
import prisma from './src/utils/database';
/// <reference path="./types/express/index.d.ts" />
// ...existing code...

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown logic
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await prisma.$disconnect();
      console.log('Database connection closed successfully.');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    } finally {
      process.exit(0);
    }
  });
};

// Listen for termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Global error handlers
process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection:', reason.stack || reason);
  // Recommended: send to a logging service
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error.stack || error);
  // It's critical to exit here as the application is in an undefined state
  shutdown('uncaughtException');
});
