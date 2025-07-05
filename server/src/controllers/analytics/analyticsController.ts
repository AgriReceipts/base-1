import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

// @desc    Get analytics for the committee, i.e percentage of each commodity in the total no of receipts
// @route   GET /api/analytics/getCommoditiesAnalytics/:committeeID
// @access  Private
export const getCommoditiesAnalytics = async (req: Request, res: Response) => {
  try {
    const committeeId = req.params.committeeId as string; // Assuming committeeId is passed as a query parameter

    if (!committeeId) {
      return res
        .status(400)
        .json({message: 'Committee ID is required for commodity analytics.'});
    }

    // Get total number of receipts for the committee
    const totalReceipts = await prisma.receipt.count({
      where: {
        committeeId: committeeId,
      },
    });

    if (totalReceipts === 0) {
      return res
        .status(200)
        .json({message: 'No receipts found for this committee.', data: []});
    }

    // Group receipts by commodity and count them
    const commodityCounts = await prisma.receipt.groupBy({
      by: ['commodityId'],
      where: {
        committeeId: committeeId,
        commodityId: {
          not: null, // Only consider receipts with a commodity
        },
      },
      _count: {
        commodityId: true,
      },
    });

    // Fetch commodity names
    const commodityIds = commodityCounts
      .map((c) => c.commodityId)
      .filter((id): id is string => id !== null);
    const commodities = await prisma.commodity.findMany({
      where: {
        id: {
          in: commodityIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const commodityNameMap = new Map(commodities.map((c) => [c.id, c.name]));

    // Calculate percentage for each commodity
    const commoditiesData = commodityCounts.map((item) => ({
      name: commodityNameMap.get(item.commodityId!) || 'Unknown Commodity',
      value: parseFloat(
        ((item._count.commodityId / totalReceipts) * 100).toFixed(2)
      ),
    }));

    return res.status(200).json({data: commoditiesData});
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

// @desc    Get analytics for the Market, i.e percentage of each committee's contribution in the total mf
// @route   GET /api/analytics/getMfAnalytics
// @access  Private
export const getMfAnalytics = async (req: Request, res: Response) => {
  try {
    // Get total market fees across all committees
    const totalMarketFeesResult = await prisma.receipt.aggregate({
      _sum: {
        feesPaid: true,
      },
      where: {
        natureOfReceipt: 'mf', // Only consider market fees
      },
    });

    const totalMarketFees =
      totalMarketFeesResult._sum.feesPaid?.toNumber() || 0; // Convert Decimal to number and handle null

    if (totalMarketFees === 0) {
      return res
        .status(200)
        .json({message: 'No market fees collected.', data: []});
    }

    // Group market fees by committee
    const committeeMfCounts = await prisma.receipt.groupBy({
      by: ['committeeId'],
      where: {
        natureOfReceipt: 'mf',
      },
      _sum: {
        feesPaid: true,
      },
    });

    // Fetch committee names
    const committeeIds = committeeMfCounts.map((c) => c.committeeId);
    const committees = await prisma.committee.findMany({
      where: {
        id: {
          in: committeeIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const committeeNameMap = new Map(committees.map((c) => [c.id, c.name]));

    // Calculate percentage for each committee's market fee contribution
    const marketFeeData = committeeMfCounts.map((item) => ({
      name: committeeNameMap.get(item.committeeId) || 'Unknown Committee',
      value: parseFloat(
        (
          ((item._sum.feesPaid?.toNumber() || 0) / totalMarketFees) *
          100
        ).toFixed(2)
      ),
    }));

    return res.status(200).json({data: marketFeeData});
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
