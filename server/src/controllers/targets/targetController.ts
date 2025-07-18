import {handlePrismaError} from '../../utils/helpers';
import {z} from 'zod';
import {
  getTargetsSchema,
  setTargetSchema,
  TargetType,
} from '../../types/target';
import prisma from '../../utils/database';
import {Prisma} from '@prisma/client';
import {Request, Response} from 'express';

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

    // Collect unique committee/year/month combinations to update analytics efficiently.
    const affectedAnalytics = new Map<
      string,
      {committeeId: string; year: number; month: number}
    >();
    for (const target of validatedTargets) {
      const key = `${target.committeeId}-${target.year}-${target.month}`;
      if (!affectedAnalytics.has(key)) {
        affectedAnalytics.set(key, {
          committeeId: target.committeeId,
          year: target.year,
          month: target.month,
        });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create or update all individual Target records
      const createdTargets: Array<
        Prisma.TargetGetPayload<{include: {committee: true; checkpost: true}}>
      > = [];

      for (const target of validatedTargets) {
        // Check if target already exists
        const existingTarget = await tx.target.findFirst({
          where: {
            committeeId: target.committeeId,
            checkpostId: target.checkpostId || null,
            year: target.year,
            month: target.month,
            type: target.type,
            isActive: true,
          },
        });

        let targetRecord;

        if (existingTarget) {
          // Update existing target
          targetRecord = await tx.target.update({
            where: {id: existingTarget.id},
            data: {
              marketFeeTarget: target.marketFeeTarget,
              updatedAt: new Date(),
            },
            include: {
              committee: true,
              checkpost: true,
            },
          });
        } else {
          // Create new target
          targetRecord = await tx.target.create({
            data: {
              committeeId: target.committeeId,
              checkpostId: target.checkpostId || null,
              year: target.year,
              month: target.month,
              type: target.type,
              marketFeeTarget: target.marketFeeTarget,
              isActive: true,
              setBy: req.user?.username || '', // Add the user ID who is setting the target, fallback to empty string if user not found
            },
            include: {
              committee: true,
              checkpost: true,
            },
          });
        }

        createdTargets.push(targetRecord);
      }

      // Step 2: Update analytics using ONLY the overall committee target.
      for (const {committeeId, year, month} of affectedAnalytics.values()) {
        // Find the specific overall committee target for this month.
        const committeeTarget = await tx.target.findFirst({
          where: {
            committeeId,
            year,
            month,
            type: TargetType.OVERALL_COMMITTEE, // Explicitly find the COMMITTEE target
            isActive: true,
          },
        });

        // Use the committee target's value, or 0 if it doesn't exist.
        const marketFeeTargetForAnalytics =
          committeeTarget?.marketFeeTarget?.toNumber() || 0;

        // Upsert the analytics record with the correct target value.
        await tx.committeeMonthlyAnalytics.upsert({
          where: {
            committeeId_year_month: {
              committeeId,
              year,
              month,
            },
          },
          update: {
            marketFeeTarget: marketFeeTargetForAnalytics,
          },
          create: {
            committeeId,
            year,
            month,
            marketFeeTarget: marketFeeTargetForAnalytics,
          },
        });
      }

      return createdTargets;
    });

    res.status(200).json({
      message: `Successfully set ${result.length} target${
        result.length > 1 ? 's' : ''
      }.`,
      data: isArray ? result : result[0],
    });
  } catch (error) {
    console.error('Error setting target:', error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({message: 'Validation error', errors: error.errors});
    }
    if (error instanceof Error && error.message.includes('checkpostId')) {
      return res.status(400).json({message: error.message});
    }
    return handlePrismaError(res, error);
  }
};

// Get Targets with filtering for Financial Year
export const getTargets = async (req: Request, res: Response) => {
  try {
    const validatedData = getTargetsSchema.parse(req.query);
    const startYear = validatedData.year;

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

    const whereClause = {
      ...baseWhere,
      OR: [
        {year: startYear, month: {gte: 4}},
        {year: startYear + 1, month: {lte: 3}},
      ],
    };

    const targets = await prisma.target.findMany({
      where: whereClause,
      include: {
        committee: {select: {id: true, name: true}},
        checkpost: {select: {id: true, name: true}},
      },
      orderBy: [
        {year: 'asc'},
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

// UPDATED: Delete Target and update analytics
export const deleteTarget = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({message: 'A valid target ID is required'});
    }

    await prisma.$transaction(async (tx) => {
      // Step 1: Find the target to be deleted.
      const targetToDelete = await tx.target.findUnique({
        where: {id},
      });

      if (!targetToDelete) {
        throw new Error('Target not found');
      }

      if (!targetToDelete.isActive) {
        // Target is already inactive, nothing to do.
        return;
      }

      // Step 2: Soft delete the target.
      await tx.target.update({
        where: {id},
        data: {isActive: false, updatedAt: new Date()},
      });

      const {committeeId, year, month} = targetToDelete;

      // MODIFIED Step 3: Find the specific overall committee target.
      const committeeTarget = await tx.target.findFirst({
        where: {
          committeeId,
          year,
          month,
          type: TargetType.OVERALL_COMMITTEE, // Explicitly find the COMMITTEE target
          isActive: true, // Ensure it's active
        },
      });

      // Use the committee target's value, or 0 if it no longer exists or is inactive.
      const newMarketFeeTarget =
        committeeTarget?.marketFeeTarget?.toNumber() || 0;

      // Step 4: Upsert the analytics record with the new correct total.
      await tx.committeeMonthlyAnalytics.upsert({
        where: {
          committeeId_year_month: {
            committeeId,
            year,
            month,
          },
        },
        update: {
          marketFeeTarget: newMarketFeeTarget,
        },
        create: {
          committeeId,
          year,
          month,
          marketFeeTarget: newMarketFeeTarget,
        },
      });
    });

    res.status(200).json({
      message: 'Target deleted and analytics updated successfully',
    });
  } catch (error) {
    console.error('Error deleting target:', error);
    if (error instanceof Error && error.message === 'Target not found') {
      return res.status(404).json({message: error.message});
    }
    return handlePrismaError(res, error);
  }
};
