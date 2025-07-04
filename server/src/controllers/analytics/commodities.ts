import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

//@desc Get analytics for all commodities
//@route GET /api/analytics/commodities
//@access Public
export const getCommodityAnalytics = async (req: Request, res: Response) => {
  try {
    // 1. Get top 3 commodities by total quantity traded (totalWeightKg)
    const topCommodityStats = await prisma.receipt.groupBy({
      by: ['commodityId'],
      where: {commodityId: {not: null}},
      _sum: {
        totalWeightKg: true,
      },
      orderBy: {
        _sum: {
          totalWeightKg: 'desc',
        },
      },
      take: 3,
    });

    // Set date range for the last 6 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 6);

    // 2. Get detailed analytics for each of the top 3 commodities
    const topCommodities = await Promise.all(
      topCommodityStats.map(async (stat) => {
        const commodityId = stat.commodityId!;

        // Fetch details in parallel
        const [commodity, traders, monthlyData] = await Promise.all([
          prisma.commodity.findUnique({where: {id: commodityId}}),
          prisma.receipt.findMany({
            where: {commodityId},
            distinct: ['traderId'],
            select: {trader: {select: {name: true}}},
          }),
          prisma.receipt.findMany({
            where: {
              commodityId,
              receiptDate: {gte: startDate, lte: endDate},
            },
            select: {receiptDate: true, totalWeightKg: true},
          }),
        ]);

        // Process monthly trade data
        const monthlyTotals: {[key: string]: number} = {};
        const monthFormatter = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          year: '2-digit',
        });

        monthlyData.forEach((item) => {
          const monthKey = monthFormatter.format(item.receiptDate);
          const weight = Number(item.totalWeightKg) || 0;
          monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + weight;
        });

        return {
          commodityName: commodity?.name || 'Unknown Commodity',
          totalQuantityTraded: Number(stat._sum.totalWeightKg),
          traders: traders.map((t) => t.trader.name),
          monthlyTrade: Object.entries(monthlyTotals).map(
            ([month, quantity]) => ({month, quantity})
          ),
        };
      })
    );

    res.status(200).json({topCommodities});
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
