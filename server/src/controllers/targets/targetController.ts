import {Request, Response} from 'express';
import {handlePrismaError} from '../../utils/helpers';
import {z} from 'zod';
import {getTargetsSchema, setTargetSchema} from '../../types/schemas';
import prisma from '../../utils/database';
import {Prisma} from '@prisma/client';

// Set Target(s) - Can handle single target or array of targets
export const setTarget = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const isArray = Array.isArray(body);
    const targetsData = isArray ? body : [body];

    // // The validation logic using .map
    const validatedTargets = targetsData.map((target, index) => {
      try {
        return setTargetSchema.parse(target);
      } catch (error) {
        // Provide more context on validation failure
        if (error instanceof z.ZodError) {
          throw new Error(
            `Validation failed for target at index ${index}: ${error.issues
              .map((e) => e.message)
              .join(', ')}`
          );
        }
        throw error;
      }
    });

    const result = await prisma.$transaction(async (tx) => {
      const createdTargets = [];

      for (const targetData of validatedTargets) {
        // Find existing target
        const existingTarget = await tx.target.findFirst({
          where: {
            year: targetData.year,
            month: targetData.month,
            committeeId: targetData.committeeId,
            checkpostId: targetData.checkpostId || null,
          },
        });

        let target;

        if (existingTarget) {
          // Update existing target
          target = await tx.target.update({
            where: {id: existingTarget.id},
            data: {
              marketFeeTarget: targetData.marketFeeTarget,
              setBy: targetData.setBy,
              notes: targetData.notes,
              type: targetData.type,
              isActive: true,
            },
            include: {
              committee: true,
              checkpost: true,
            },
          });
        } else {
          // Create new target
          target = await tx.target.create({
            data: {
              ...targetData,
              checkpostId: targetData.checkpostId || null,
              marketFeeTarget: targetData.marketFeeTarget || 0,
              type: targetData.type,
              notes: targetData.notes || null,
            },
            include: {
              committee: true,
              checkpost: true,
            },
          });
        }

        createdTargets.push(target);
      }

      return createdTargets;
    });

    res.status(200).json({
      message: `Successfully set ${result.length} target${
        result.length > 1 ? 's' : ''
      }.`,
      data: isArray ? result : result[0], // Return single object if input was single
    });
  } catch (error) {
    console.error('Error setting target:', error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({message: 'Validation error', errors: error.errors});
    }
    // Assuming you have a standard Prisma error handler
    return handlePrismaError(res, error);
  }
};

// Get Targets with filtering
export const getTargets = async (req: Request, res: Response) => {
  try {
    const validatedData = getTargetsSchema.parse(req.query);

    const whereClause: any = {
      year: validatedData.year,
      isActive: true,
      type: validatedData.type,
    };

    if (validatedData.committeeId) {
      whereClause.committeeId = validatedData.committeeId;
      whereClause.checkpostId = validatedData.checkPostId;
    }

    const targets = await prisma.target.findMany({
      where: whereClause,
      include: {
        committee: {
          select: {
            id: true,
            name: true,
          },
        },
        checkpost: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {year: 'desc'},
        {month: 'asc'},
        {committeeId: 'asc'},
        {checkpostId: 'asc'},
      ],
    });

    res.status(200).json(targets);
  } catch (error) {
    console.error('Error fetching targets:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
    }
    return handlePrismaError(res, error);
  }
};

// Delete Target (Soft delete by setting isActive to false)
export const deleteTarget = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    console.log('the id is', id);

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        message: 'Please send a valid target ID',
      });
    }
    // Validate that the target exists
    const existingTarget = await prisma.target.findUnique({
      where: {id},
    });

    if (!existingTarget) {
      return res.status(404).json({
        message: 'Target not found',
      });
    }

    // Soft delete the target
    await prisma.target.update({
      where: {id},
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: 'Target deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting target:', error);
    return handlePrismaError(res, error);
  }
};
