import jwt from 'jsonwebtoken';
import {Response} from 'express';
import {Prisma} from '@prisma/client';

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export const handlePrismaError = (res: Response, error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint failed
        return res.status(409).json({
          message: `Duplicate value for field(s): ${
            Array.isArray(error.meta?.target)
              ? error.meta?.target.join(', ')
              : String(error.meta?.target ?? 'unknown')
          }`,
        });

      case 'P2003':
        // Foreign key constraint failed
        return res.status(400).json({
          message: `Foreign key constraint failed on field(s): ${
            error.meta?.field_name || 'unknown'
          }`,
        });

      case 'P2025':
        // Record not found
        return res.status(404).json({
          message: 'Record not found or already deleted.',
        });

      default:
        return res.status(400).json({
          message: `Database error [${error.code}]`,
          details: error.message,
        });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: 'Validation failed. Check input fields and data types.',
      details: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      message: 'Database initialization error. Check your DB connection.',
      details: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(500).json({
      message: 'Unexpected internal database error. Please try again later.',
    });
  }

  // fallback for unhandled errors
  console.error('Unexpected error:', error);
  return res.status(500).json({message: 'Unexpected server error'});
};
