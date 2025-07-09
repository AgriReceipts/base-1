import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

//@desc Get top traders analytics for a committee (default route)
//@route GET /api/analytics/traders/:committeeId
//@access Private
export const getTopTradersAnalytics = async (req: Request, res: Response) => {
  const {committeeId} = req.params;
  const {year, month, limit = '5'} = req.query;

  const limitNum = parseInt(limit as string, 10) || 5;
  const yearNum = year ? parseInt(year as string, 10) : undefined;
  const monthNum = month ? parseInt(month as string, 10) : undefined;

  if (!committeeId) {
    return res.status(400).json({message: 'Committee ID is required.'});
  }

  if (month && !year) {
    return res
      .status(400)
      .json({error: 'Year is required when month is specified'});
  }

  if (year && isNaN(yearNum!)) {
    return res.status(400).json({error: 'Invalid year'});
  }

  if (month && isNaN(monthNum!)) {
    return res.status(400).json({error: 'Invalid month'});
  }

  try {
    // Build where clause for filtering
    const whereClause: any = {
      committeeId,
      ...(yearNum !== undefined && {year: yearNum}),
      ...(monthNum !== undefined && {month: monthNum}),
    };

    // Get top traders by total value (monthly)
    const topTradersMonthly = await prisma.traderMonthlyAnalytics.groupBy({
      by: ['traderId'],
      where: whereClause,
      _sum: {
        totalValue: true,
        totalReceipts: true,
        totalFeesPaid: true,
        totalQuantity: true,
      },
      orderBy: {
        _sum: {
          totalValue: 'desc',
        },
      },
      take: limitNum,
    });

    //Get total active traders for the month

    // Get trader details for the top traders
    const traderIds = topTradersMonthly.map((item) => item.traderId);
    const traderDetails = await prisma.trader.findMany({
      where: {
        id: {in: traderIds},
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Get top traders overall analytics
    const topTradersOverall = await prisma.traderOverallAnalytics.findMany({
      where: {
        committeeId,
        traderId: {in: traderIds},
      },
      orderBy: {
        totalValue: 'desc',
      },
    });

    // Combine the data
    const monthlyData = topTradersMonthly.map((item) => {
      const trader = traderDetails.find((t) => t.id === item.traderId);
      return {
        traderId: item.traderId,
        trader,
        totalReceipts: item._sum.totalReceipts || 0,
        totalValue: parseFloat(item._sum.totalValue?.toString() || '0'),
        totalFeesPaid: parseFloat(item._sum.totalFeesPaid?.toString() || '0'),
        totalQuantity: parseFloat(item._sum.totalQuantity?.toString() || '0'),
      };
    });

    const overallData = topTradersOverall.map((item) => {
      const trader = traderDetails.find((t) => t.id === item.traderId);
      return {
        traderId: item.traderId,
        trader,
        totalReceipts: item.totalReceipts,
        totalValue: parseFloat(item.totalValue.toString()),
        totalFeesPaid: parseFloat(item.totalFeesPaid.toString()),
        totalQuantity: parseFloat(item.totalQuantity.toString()),
      };
    });

    const traderMonthlyStats = await prisma.traderMonthlyAnalytics.findMany({
      where: whereClause,
      select: {
        traderId: true,
        totalFeesPaid: true,
        totalReceipts: true,
      },
    });

    const uniqueTraderCount = new Set(traderMonthlyStats.map((t) => t.traderId))
      .size;

    const totalFeesPaid = traderMonthlyStats.reduce(
      (sum, t) => sum + Number(t.totalFeesPaid),
      0
    );

    const totalReceipts = traderMonthlyStats.reduce(
      (sum, t) => sum + t.totalReceipts,
      0
    );

    const avgFeesPerTrader =
      uniqueTraderCount > 0 ? totalFeesPaid / uniqueTraderCount : 0;

    return res.status(200).json({
      success: true,
      data: {
        period:
          yearNum !== undefined && monthNum !== undefined
            ? `${yearNum}-${monthNum.toString().padStart(2, '0')}`
            : yearNum !== undefined
            ? `${yearNum}`
            : 'All time',
        topTradersMonthly: monthlyData,
        topTradersOverall: overallData,
        totalMonthlyTraders: uniqueTraderCount,
        totalMonthyFees: totalFeesPaid,
        totalMonthlyReceipts: totalReceipts,
        avgMonthlyFees: avgFeesPerTrader,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Error fetching top traders analytics:', error);
    return handlePrismaError(res, error);
  }
};

//@desc Get detailed analytics for a specific trader
//@route GET /api/analytics/traders/:committeeId/:traderId
//@access Private
export const getTraderDetailedAnalytics = async (
  req: Request,
  res: Response
) => {
  const {committeeId, traderId} = req.params;
  const {year, month} = req.query;

  const yearNum = year ? parseInt(year as string, 10) : undefined;
  const monthNum = month ? parseInt(month as string, 10) : undefined;

  if (!committeeId || !traderId) {
    return res
      .status(400)
      .json({message: 'Committee ID and Trader ID are required.'});
  }

  if (month && !year) {
    return res
      .status(400)
      .json({error: 'Year is required when month is specified'});
  }

  if (year && isNaN(yearNum!)) {
    return res.status(400).json({error: 'Invalid year'});
  }

  if (month && isNaN(monthNum!)) {
    return res.status(400).json({error: 'Invalid month'});
  }

  try {
    // Build where clause for filtering
    const whereClause: any = {
      traderId,
      committeeId,
      ...(yearNum !== undefined && {year: yearNum}),
      ...(monthNum !== undefined && {month: monthNum}),
    };

    // Get monthly analytics
    const monthlyAnalytics = await prisma.traderMonthlyAnalytics.findMany({
      where: whereClause,
      include: {
        trader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{year: 'desc'}, {month: 'desc'}],
    });

    // Get overall analytics
    const overallAnalytics = await prisma.traderOverallAnalytics.findUnique({
      where: {
        traderId_committeeId: {
          traderId,
          committeeId,
        },
      },
      include: {
        trader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Generate insights
    const insights = generateTraderInsights(monthlyAnalytics, overallAnalytics);

    return res.status(200).json({
      success: true,
      data: {
        trader: monthlyAnalytics[0]?.trader || overallAnalytics?.trader,
        monthlyAnalytics: monthlyAnalytics.map((item) => ({
          year: item.year,
          month: item.month,
          totalReceipts: item.totalReceipts,
          totalValue: parseFloat(item.totalValue.toString()),
          totalFeesPaid: parseFloat(item.totalFeesPaid.toString()),
          totalQuantity: parseFloat(item.totalQuantity.toString()),
        })),
        overallAnalytics: overallAnalytics
          ? {
              totalReceipts: overallAnalytics.totalReceipts,
              totalValue: parseFloat(overallAnalytics.totalValue.toString()),
              totalFeesPaid: parseFloat(
                overallAnalytics.totalFeesPaid.toString()
              ),
              totalQuantity: parseFloat(
                overallAnalytics.totalQuantity.toString()
              ),
            }
          : null,

        insights,
      },
    });
  } catch (error) {
    console.error('Error fetching trader detailed analytics:', error);
    return handlePrismaError(res, error);
  }
};

// Helper function to generate insights for traders
function generateTraderInsights(monthlyData: any[], overallData: any) {
  const insights = [];

  if (monthlyData.length === 0) {
    insights.push('No monthly data available for this trader');
    return insights;
  }

  // Average analysis
  const avgValue =
    monthlyData.reduce(
      (sum, item) => sum + parseFloat(item.totalValue.toString()),
      0
    ) / monthlyData.length;

  const avgReceipts =
    monthlyData.reduce((sum, item) => sum + item.totalReceipts, 0) /
    monthlyData.length;

  insights.push(`Average monthly value: ₹${avgValue.toLocaleString()}`);

  insights.push(`Average monthly receipts: ${avgReceipts.toFixed(0)}`);

  // Activity analysis
  if (overallData) {
    const daysSinceFirst = overallData.firstTransactionDate
      ? Math.floor(
          (new Date().getTime() - overallData.firstTransactionDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;
    const daysSinceLast = overallData.lastTransactionDate
      ? Math.floor(
          (new Date().getTime() - overallData.lastTransactionDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    insights.push(
      `Trading history: ${daysSinceFirst} days since first transaction`
    );

    if (daysSinceLast === 0) {
      insights.push('Recent activity: Active today');
    } else if (daysSinceLast <= 7) {
      insights.push(
        `Recent activity: Last transaction ${daysSinceLast} days ago`
      );
    } else {
      insights.push(`Recent activity: Inactive for ${daysSinceLast} days`);
    }
  }

  return insights;
}
