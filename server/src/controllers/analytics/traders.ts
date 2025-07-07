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
        averageValuePerReceipt:
          (item._sum.totalReceipts || 0) > 0
            ? parseFloat(item._sum.totalValue?.toString() || '0') /
              (item._sum.totalReceipts || 1)
            : 0,
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
        averageValuePerReceipt:
          item.totalReceipts > 0
            ? parseFloat(item.totalValue.toString()) / item.totalReceipts
            : 0,
        firstTransactionDate: item.firstTransactionDate,
        lastTransactionDate: item.lastTransactionDate,
      };
    });

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

    // Calculate trends (growth/decline patterns)
    const trends = calculateTraderTrends(monthlyAnalytics);

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
          averageValuePerReceipt:
            item.totalReceipts > 0
              ? parseFloat(item.totalValue.toString()) / item.totalReceipts
              : 0,
          averageQuantityPerReceipt:
            item.totalReceipts > 0
              ? parseFloat(item.totalQuantity.toString()) / item.totalReceipts
              : 0,
          averageValuePerKg:
            parseFloat(item.totalQuantity.toString()) > 0
              ? parseFloat(item.totalValue.toString()) /
                parseFloat(item.totalQuantity.toString())
              : 0,
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
              averageValuePerReceipt:
                overallAnalytics.totalReceipts > 0
                  ? parseFloat(overallAnalytics.totalValue.toString()) /
                    overallAnalytics.totalReceipts
                  : 0,
              averageQuantityPerReceipt:
                overallAnalytics.totalReceipts > 0
                  ? parseFloat(overallAnalytics.totalQuantity.toString()) /
                    overallAnalytics.totalReceipts
                  : 0,
              averageValuePerKg:
                parseFloat(overallAnalytics.totalQuantity.toString()) > 0
                  ? parseFloat(overallAnalytics.totalValue.toString()) /
                    parseFloat(overallAnalytics.totalQuantity.toString())
                  : 0,
              firstTransactionDate: overallAnalytics.firstTransactionDate,
              lastTransactionDate: overallAnalytics.lastTransactionDate,
              daysSinceFirstTransaction: overallAnalytics.firstTransactionDate
                ? Math.floor(
                    (new Date().getTime() -
                      overallAnalytics.firstTransactionDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0,
              daysSinceLastTransaction: overallAnalytics.lastTransactionDate
                ? Math.floor(
                    (new Date().getTime() -
                      overallAnalytics.lastTransactionDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0,
            }
          : null,
        trends,
        insights,
      },
    });
  } catch (error) {
    console.error('Error fetching trader detailed analytics:', error);
    return handlePrismaError(res, error);
  }
};

// Helper function to calculate trends for traders
function calculateTraderTrends(monthlyData: any[]) {
  if (monthlyData.length < 2) {
    return {
      valueGrowth: 0,
      quantityGrowth: 0,
      receiptsGrowth: 0,
      trend: 'insufficient_data',
    };
  }

  const latest = monthlyData[0];
  const previous = monthlyData[1];

  const valueGrowth =
    parseFloat(previous.totalValue.toString()) > 0
      ? ((parseFloat(latest.totalValue.toString()) -
          parseFloat(previous.totalValue.toString())) /
          parseFloat(previous.totalValue.toString())) *
        100
      : 0;

  const quantityGrowth =
    parseFloat(previous.totalQuantity.toString()) > 0
      ? ((parseFloat(latest.totalQuantity.toString()) -
          parseFloat(previous.totalQuantity.toString())) /
          parseFloat(previous.totalQuantity.toString())) *
        100
      : 0;

  const receiptsGrowth =
    previous.totalReceipts > 0
      ? ((latest.totalReceipts - previous.totalReceipts) /
          previous.totalReceipts) *
        100
      : 0;

  let trend = 'stable';
  if (valueGrowth > 5) trend = 'growing';
  else if (valueGrowth < -5) trend = 'declining';

  return {
    valueGrowth: parseFloat(valueGrowth.toFixed(2)),
    quantityGrowth: parseFloat(quantityGrowth.toFixed(2)),
    receiptsGrowth: parseFloat(receiptsGrowth.toFixed(2)),
    trend,
  };
}

// Helper function to generate insights for traders
function generateTraderInsights(monthlyData: any[], overallData: any) {
  const insights = [];

  if (monthlyData.length === 0) {
    insights.push('No monthly data available for this trader');
    return insights;
  }

  // Peak month analysis
  const peakMonth = monthlyData.reduce((max, current) =>
    parseFloat(current.totalValue.toString()) >
    parseFloat(max.totalValue.toString())
      ? current
      : max
  );

  insights.push(
    `Peak performance: ${peakMonth.year}-${peakMonth.month
      .toString()
      .padStart(2, '0')} with ₹${parseFloat(
      peakMonth.totalValue.toString()
    ).toLocaleString()}`
  );

  // Average analysis
  const avgValue =
    monthlyData.reduce(
      (sum, item) => sum + parseFloat(item.totalValue.toString()),
      0
    ) / monthlyData.length;
  const avgQuantity =
    monthlyData.reduce(
      (sum, item) => sum + parseFloat(item.totalQuantity.toString()),
      0
    ) / monthlyData.length;
  const avgReceipts =
    monthlyData.reduce((sum, item) => sum + item.totalReceipts, 0) /
    monthlyData.length;

  insights.push(`Average monthly value: ₹${avgValue.toLocaleString()}`);
  insights.push(`Average monthly quantity: ${avgQuantity.toFixed(2)} kg`);
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

  // Consistency analysis
  const consistencyScore = calculateConsistencyScore(monthlyData);
  insights.push(
    `Consistency score: ${consistencyScore}% (regularity of transactions)`
  );

  // Seasonal patterns (if enough data)
  if (monthlyData.length >= 12) {
    const monthlyAvg = Array(12)
      .fill(0)
      .map((_, i) => {
        const monthData = monthlyData.filter((item) => item.month === i + 1);
        return monthData.length > 0
          ? monthData.reduce(
              (sum, item) => sum + parseFloat(item.totalValue.toString()),
              0
            ) / monthData.length
          : 0;
      });

    const peakSeasonMonth = monthlyAvg.indexOf(Math.max(...monthlyAvg)) + 1;
    const lowSeasonMonth = monthlyAvg.indexOf(Math.min(...monthlyAvg)) + 1;

    insights.push(
      `Peak season: Month ${peakSeasonMonth}, Low season: Month ${lowSeasonMonth}`
    );
  }

  return insights;
}

// Helper function to calculate consistency score
function calculateConsistencyScore(monthlyData: any[]): number {
  if (monthlyData.length < 3) return 0;

  const values = monthlyData.map((item) =>
    parseFloat(item.totalValue.toString())
  );
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const standardDeviation = Math.sqrt(variance);

  // Calculate coefficient of variation (lower is more consistent)
  const coefficientOfVariation =
    mean > 0 ? (standardDeviation / mean) * 100 : 100;

  // Convert to consistency score (higher is more consistent)
  const consistencyScore = Math.max(0, 100 - coefficientOfVariation);

  return Math.round(consistencyScore);
}
