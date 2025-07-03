import {PrismaClient} from '@prisma/client';

// Create a single instance of PrismaClient
const prisma = new PrismaClient({
  log: ['error'],
  // process.env.NODE_ENV === 'development'
  // ? ['query', 'error', 'warn']
  // : ['error'],
});

// Export the instance
export default prisma;

// Helper function to handle database errors
export const handleDatabaseError = (error: any) => {
  console.error('Database Error:', error);

  // Prisma specific errors
  if (error.code === 'P2002') {
    return {
      status: 400,
      message: 'A record with this data already exists',
    };
  }

  if (error.code === 'P2025') {
    return {
      status: 404,
      message: 'Record not found',
    };
  }

  // Generic database error
  return {
    status: 500,
    message: 'Database error occurred',
  };
};
