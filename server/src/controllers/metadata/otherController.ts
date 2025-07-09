import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

// @desc    Gets all commodities
// @route   GET /api/metaData/commodities
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

// @desc    Gets all commities
// @route   GET /api/metaData/commities
// @access  Public

export const getAllCommitties = async (req: Request, res: Response) => {
  try {
    const committees = await prisma.committee.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json({
      message: 'Commities Fetchec Successfully',
      data: committees,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

// @desc    Gets all checkposts for a committee
// @route   GET /api/metadata/checkpost/:committeeId
// @access  Public
export const getCheckPosts = async (req: Request, res: Response) => {
  console.log('this got hit instead');
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

// @desc    Gets all checkposts
// @route   GET /api/metadata/checkpost/getAllCheckposts
// @access  Public

export const getAllCommitteesWithCheckposts = async (
  req: Request,
  res: Response
) => {
  try {
    const committees = await prisma.committee.findMany({
      select: {
        id: true,
        name: true,
        checkposts: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Committees fetched successfully',
      data: committees,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

// @desc    Gets all traders
// @route   GET /api/metaData/traders
// @access  Public

export const getAllTraders = async (req: Request, res: Response) => {
  try {
    const traders = await prisma.trader.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const names = traders.map((item) => item.name);

    return res.status(200).json({
      message: 'Traders Fetched Successfully',
      data: names,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
