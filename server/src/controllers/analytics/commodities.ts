import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

//@desc Get top commodities analytics for a committee (default route)
//@route GET /api/analytics/commodityAnalytics/:committeeId
//@access Private
export const getTopCommoditiesAnalytics = async (
  req: Request,
  res: Response
) => {
  const {committeeId} = req.params;
  const {year, month, limit = '5'} = req.query;
  const limitNum = parseInt(limit as string, 10) || 5;
  const yearNum = year ? parseInt(year as string, 10) : undefined;
  const monthNum = month ? parseInt(month as string, 10) : undefined;

  // Validation
  if (!committeeId) {
    return res.status(400).json({
      success: false,
      message: 'Committee ID is required.',
    });
  }
  if (month && !year) {
    return res.status(400).json({
      success: false,
      error: 'Year is required when month is specified',
    });
  }
  if (year && isNaN(yearNum!)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid year',
    });
  }
  if (month && isNaN(monthNum!)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid month',
    });
  }

  try {
    // Single optimized query for monthly data
    const monthlyWhereClause = {
      committeeId,
      ...(yearNum && {year: yearNum}),
      ...(monthNum && {month: monthNum}),
    };

    const [monthlyData, overallData] = await Promise.all([
      // Monthly/filtered data
      prisma.commodityMonthlyAnalytics.groupBy({
        by: ['commodityId'],
        where: monthlyWhereClause,
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
      }),
      // Overall data (only if not filtering by month/year)
      !yearNum && !monthNum
        ? prisma.commodityOverallAnalytics.findMany({
            where: {committeeId},
            orderBy: {totalValue: 'desc'},
            take: limitNum,
            select: {
              commodityId: true,
              totalReceipts: true,
              totalValue: true,
              totalFeesPaid: true,
              totalQuantity: true,
              commodity: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                },
              },
            },
          })
        : [],
    ]);

    // Get commodity details in single query
    const commodityIds = monthlyData.map((item) => item.commodityId);
    const commodityDetails = await prisma.commodity.findMany({
      where: {id: {in: commodityIds}},
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    // Create commodity lookup map for O(1) access
    const commodityMap = commodityDetails.reduce((acc, commodity) => {
      acc[commodity.id] = commodity;
      return acc;
    }, {} as Record<string, (typeof commodityDetails)[0]>);

    // Transform monthly data
    const transformedMonthlyData = monthlyData.map((item) => {
      const commodity = commodityMap[item.commodityId];
      const totalValue = parseFloat(item._sum.totalValue?.toString() || '0');
      const totalReceipts = item._sum.totalReceipts || 0;
      const totalFeesPaid = parseFloat(
        item._sum.totalFeesPaid?.toString() || '0'
      );
      const totalQuantity = parseFloat(
        item._sum.totalQuantity?.toString() || '0'
      );

      return {
        commodityId: item.commodityId,
        commodity: commodity || {
          id: item.commodityId,
          name: 'Unknown Commodity',
          category: 'Unknown',
        },
        totalReceipts,
        totalValue,
        totalFeesPaid,
        totalQuantity,
        averageValuePerReceipt:
          totalReceipts > 0 ? totalValue / totalReceipts : 0,
      };
    });

    // Transform overall data
    const transformedOverallData = overallData.map((item) => ({
      commodityId: item.commodityId,
      commodity: {
        id: item.commodity.id,
        name: item.commodity.name,
        category: item.commodity.category,
      },
      totalReceipts: item.totalReceipts,
      totalValue: parseFloat(item.totalValue?.toString() || '0'),
      totalFeesPaid: parseFloat(item.totalFeesPaid?.toString() || '0'),
      totalQuantity: parseFloat(item.totalQuantity?.toString() || '0'),
      averageValuePerReceipt:
        item.totalReceipts > 0
          ? parseFloat(item.totalValue?.toString() || '0') / item.totalReceipts
          : 0,
    }));

    // Determine period string
    let period = 'Overall';
    if (yearNum && monthNum) {
      period = `${yearNum}-${monthNum.toString().padStart(2, '0')}`;
    } else if (yearNum) {
      period = yearNum.toString();
    }

    return res.status(200).json({
      success: true,
      data: {
        period,
        topCommoditiesMonthly: transformedMonthlyData,
        topCommoditiesOverall: transformedOverallData,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Error in getTopCommoditiesAnalytics:', error);
    handlePrismaError(res, error);
  }
};

//@desc Get detailed analytics for a specific commodity
//@route GET /api/analytics/commodityDetailedAnalytics/:committeeId/:commodityId
//@access Private
export const getDetailedCommodityAnalytics = async (
  req: Request,
  res: Response
) => {
  const {committeeId, commodityId} = req.params;
  const {year, month} = req.query;
  const yearNum = year ? parseInt(year as string, 10) : undefined;
  const monthNum = month ? parseInt(month as string, 10) : undefined;

  console.log('cmooi', committeeId, commodityId);

  // Validation
  if (!committeeId || !commodityId) {
    return res.status(400).json({
      success: false,
      message: 'Committee ID and Commodity ID are required.',
    });
  }

  try {
    // Get commodity details
    const commodity = await prisma.commodity.findUnique({
      where: {id: commodityId},
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    if (!commodity) {
      return res.status(404).json({
        success: false,
        message: 'Commodity not found',
      });
    }

    // Monthly analytics query
    const monthlyWhereClause = {
      committeeId,
      commodityId,
      ...(yearNum && {year: yearNum}),
      ...(monthNum && {month: monthNum}),
    };

    const [monthlyAnalytics, overallAnalytics] = await Promise.all([
      // Monthly data
      prisma.commodityMonthlyAnalytics.findMany({
        where: monthlyWhereClause,
        orderBy: [{year: 'desc'}, {month: 'desc'}],
        select: {
          year: true,
          month: true,
          totalReceipts: true,
          totalValue: true,
          totalFeesPaid: true,
          totalQuantity: true,
        },
      }),
      // Overall analytics
      prisma.commodityOverallAnalytics.findUnique({
        where: {
          commodityId_committeeId: {
            committeeId,
            commodityId,
          },
        },
        select: {
          totalReceipts: true,
          totalValue: true,
          totalFeesPaid: true,
          totalQuantity: true,
        },
      }),
    ]);

    // Calculate trends (simple growth calculation)
    const calculateTrends = () => {
      if (monthlyAnalytics.length < 2) {
        return {
          valueGrowth: 0,
          quantityGrowth: 0,
          receiptsGrowth: 0,
          trend: 'stable',
        };
      }

      const latest = monthlyAnalytics[0];
      const previous = monthlyAnalytics[1];

      const valueGrowth = previous.totalValue
        ? ((latest.totalValue.toNumber() - previous.totalValue.toNumber()) /
            previous.totalValue.toNumber()) *
          100
        : 0;

      const quantityGrowth = previous.totalQuantity
        ? ((latest.totalQuantity.toNumber() -
            previous.totalQuantity.toNumber()) /
            previous.totalQuantity.toNumber()) *
          100
        : 0;

      const receiptsGrowth = previous.totalReceipts
        ? ((latest.totalReceipts - previous.totalReceipts) /
            previous.totalReceipts) *
          100
        : 0;

      let trend = 'stable';
      if (valueGrowth > 5) trend = 'growing';
      else if (valueGrowth < -5) trend = 'declining';

      return {
        valueGrowth: Math.round(valueGrowth * 100) / 100,
        quantityGrowth: Math.round(quantityGrowth * 100) / 100,
        receiptsGrowth: Math.round(receiptsGrowth * 100) / 100,
        trend,
      };
    };

    // Generate insights
    const generateInsights = () => {
      const insights: string[] = [];
      const trends = calculateTrends();

      if (trends.valueGrowth > 10) {
        insights.push(
          `Strong value growth of ${trends.valueGrowth.toFixed(1)}% observed`
        );
      } else if (trends.valueGrowth < -10) {
        insights.push(
          `Significant value decline of ${Math.abs(trends.valueGrowth).toFixed(
            1
          )}% noted`
        );
      }

      if (monthlyAnalytics.length > 0) {
        const avgReceipts =
          monthlyAnalytics.reduce((sum, item) => sum + item.totalReceipts, 0) /
          monthlyAnalytics.length;
        insights.push(`Average monthly receipts: ${Math.round(avgReceipts)}`);
      }

      return insights;
    };

    const transformedOverallAnalytics = overallAnalytics
      ? {
          totalReceipts: overallAnalytics.totalReceipts,
          totalValue: parseFloat(
            overallAnalytics.totalValue?.toString() || '0'
          ),
          totalFeesPaid: parseFloat(
            overallAnalytics.totalFeesPaid?.toString() || '0'
          ),
          totalQuantity: parseFloat(
            overallAnalytics.totalQuantity?.toString() || '0'
          ),
        }
      : null;

    const transformedMonthlyAnalytics = monthlyAnalytics.map((item) => ({
      year: item.year,
      month: item.month,
      totalReceipts: item.totalReceipts,
      totalValue: parseFloat(item.totalValue?.toString() || '0'),
      totalFeesPaid: parseFloat(item.totalFeesPaid?.toString() || '0'),
      totalQuantity: parseFloat(item.totalQuantity?.toString() || '0'),
    }));

    return res.status(200).json({
      success: true,
      data: {
        commodity,
        monthlyAnalytics: transformedMonthlyAnalytics,
        overallAnalytics: transformedOverallAnalytics,
        trends: calculateTrends(),
        insights: generateInsights(),
      },
    });
  } catch (error) {
    console.error('Error in getDetailedCommodityAnalytics:', error);
    handlePrismaError(res, error);
  }
};
