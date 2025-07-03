import {Request, Response} from 'express';
import prisma from '../utils/database';
import {handlePrismaError} from '../utils/helpers';
import {da} from '@faker-js/faker/.';

// @desc    Gets all commodities
// @route   GET /api/metadata/getAllCommodities
// @access  Public
export const getAllCommodities = async (req: Request, res: Response) => {
  try {
    const commodities = await prisma.commodity.findMany({
      select: {
        name: true,
      },
    });

    const names = commodities.map((item) => item.name);
    return res.status(200).json({
      message: 'Commodities fetched successfully',
      data: names,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

// @desc    Gets all checkposts for a committee
// @route   GET /api/metadata/checkpost/:committeeId
// @access  Public
export const getCheckPosts = async (req: Request, res: Response) => {
  const committeeId = req.params.committeeId;
  try {
    const checkposts = await prisma.committee.findUnique({
      where: {
        id: committeeId,
      },
      select: {
        checkposts: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!checkposts) {
      return res.status(404).json({
        message: 'Committee not found',
      });
    }

    return res.status(200).json({
      message: 'Checkposts fetched successfully',
      data: checkposts,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
