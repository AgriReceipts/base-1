import {Request, Response} from 'express';
import {handlePrismaError} from '../../utils/helpers';
import {z} from 'zod';
import {
  getTargetsSchema,
  setTargetSchema,
  TargetType,
} from '../../types/target';
import prisma from '../../utils/database';
import {Prisma} from '@prisma/client';

// Set Target(s) - Can handle single target or array of targets
export const setTarget = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const isArray = Array.isArray(body);
    const targetsData = isArray ? body : [body];

    // Validation logic using .map
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
      const createdTargets: Array<
        Prisma.TargetGetPayload<{include: {committee: true; checkpost: true}}>
      > = [];

      for (const targetData of validatedTargets) {
        // Validate business logic based on type
        if (
          targetData.type === TargetType.CHECKPOST &&
          !targetData.checkpostId
        ) {
          throw new Error('checkpostId is required when type is CHECKPOST');
        }

        if (
          targetData.type !== TargetType.CHECKPOST &&
          targetData.checkpostId
        ) {
          throw new Error(
            'checkpostId should only be provided when type is CHECKPOST'
          );
        }

        // Find existing target using the new unique constraint
        const existingTarget = await tx.target.findFirst({
          where: {
            year: targetData.year,
            month: targetData.month,
            committeeId: targetData.committeeId,
            type: targetData.type,
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
              year: targetData.year,
              month: targetData.month,
              committeeId: targetData.committeeId,
              checkpostId: targetData.checkpostId || null,
              marketFeeTarget: targetData.marketFeeTarget || 0,
              type: targetData.type,
              setBy: targetData.setBy,
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
    // Handle custom business logic errors
    if (error instanceof Error && error.message.includes('checkpostId')) {
      return res.status(400).json({message: error.message});
    }
    // Assuming you have a standard Prisma error handler
    return handlePrismaError(res, error);
  }
};

// Get Targets with filtering for Financial Year
export const getTargets = async (req: Request, res: Response) => {
  try {
    const validatedData = getTargetsSchema.parse(req.query);
    const startYear = validatedData.year;

    // Base conditions that apply to all parts of the query
    const baseWhere: any = {
      isActive: true,
      type: validatedData.type,
    };

    if (validatedData.committeeId) {
      baseWhere.committeeId = validatedData.committeeId;

      if (validatedData.checkPostId) {
        baseWhere.checkpostId = validatedData.checkPostId;
      }
    }

    // Combine base conditions with the financial year logic
    const whereClause = {
      ...baseWhere,
      // This OR condition defines the financial year
      OR: [
        // Condition 1: Records from April (month 4) to December of the starting year
        {
          year: startYear,
          month: {gte: 4}, // gte = Greater Than or Equal To
        },
        // Condition 2: Records from January to March (month 3) of the next year
        {
          year: startYear + 1,
          month: {lte: 3}, // lte = Less Than or Equal To
        },
      ],
    };

    const targets = await prisma.target.findMany({
      where: whereClause,
      include: {
        committee: {select: {id: true, name: true}},
        checkpost: {select: {id: true, name: true}},
      },
      orderBy: [
        {year: 'asc'}, // Sort by year first, then month
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
