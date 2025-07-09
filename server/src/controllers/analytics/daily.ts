import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

// @desc    Get Daily analytics for the committee
// @route   GET /api/analytics/dailyAnalytics/:committeeId/:date
// @access  Private
export const getDailyAnalytics = async (req: Request, res: Response) => {
  try {
    const {committeeId, date} = req.params;

    if (!committeeId || !date) {
      return res
        .status(400)
        .json({
          message: 'Committee ID and date is required for daily analytics.',
        });
    }

    const dailyAnalyticsData = await prisma.dailyAnalytics.findUnique({
      where: {
        receiptDate_committeeId: {
          receiptDate: date,
          committeeId: committeeId,
        },
      },
      select: {
        totalReceipts: true,
        totalValue: true,
        totalFeesPaid: true,
        totalQuantity: true,
        mf_fees: true,
        officeFees: true,
        checkpostFees: true,
        otherFees: true,
        uniqueTraders: true,
        uniqueCommodities: true,
        monthToDateFees: true,
        monthToDateReceipts: true,
        monthToDateValue: true,
        yearToDateFees: true,
        yearToDateReceipts: true,
        yearToDateValue: true,
        checkpost: true,
      },
    });

    return res.status(200).json({data: dailyAnalyticsData});
  } catch (error) {
    return handlePrismaError(res, error);
  }
};

//Todo:change this later to get all committes aggregated daily analytics
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
