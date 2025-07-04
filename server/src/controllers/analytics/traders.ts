import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

//@desc Get analytics for all traders
//@route GET /api/analytics/traders
//@access Public
export const getTraderAnalytics = async (req: Request, res: Response) => {
  try {
    // 1. Fetch overall summary metrics in parallel for efficiency
    const [totalTraders, totalReceipts, totalValueAggregate, totalMfAggregate] =
      await Promise.all([
        prisma.trader.count({where: {isActive: true}}),
        prisma.receipt.count(),
        prisma.receipt.aggregate({
          _sum: {value: true},
        }),
        prisma.receipt.aggregate({
          _sum: {feesPaid: true},
          where: {natureOfReceipt: 'mf'},
        }),
      ]);

    const totalValue = totalValueAggregate._sum.value || 0;
    const totalMfValue = totalMfAggregate._sum.feesPaid || 0;

    const summary = {
      totalTraders,
      totalReceipts,
      totalValue: Number(totalValue),
      totalMfValue: Number(totalMfValue),
      avgMfOfReceipt:
        totalReceipts > 0
          ? parseFloat((Number(totalMfValue) / totalReceipts).toFixed(2))
          : 0,
    };

    // 2. Get top 3 traders based on the value they traded
    const topTraderStats = await prisma.receipt.groupBy({
      by: ['traderId'],
      _sum: {
        value: true,
        feesPaid: true,
        totalWeightKg: true,
      },
      _count: {
        _all: true,
      },
      _max: {
        receiptDate: true,
      },
      orderBy: {
        _sum: {
          value: 'desc',
        },
      },
      take: 3,
    });

    // 3. Fetch detailed information for each top trader
    const topTraders = await Promise.all(
      topTraderStats.map(async (stat) => {
        const [trader, commoditiesTraded] = await Promise.all([
          prisma.trader.findUnique({
            where: {id: stat.traderId},
            select: {name: true},
          }),
          prisma.receipt.findMany({
            where: {traderId: stat.traderId, commodityId: {not: null}},
            distinct: ['commodityId'],
            select: {
              commodity: {
                select: {name: true},
              },
            },
          }),
        ]);

        return {
          traderName: trader?.name || 'Unknown Trader',
          totalReceipts: stat._count._all,
          totalValue: Number(stat._sum.value),
          mfCollected: Number(stat._sum.feesPaid),
          commodities: commoditiesTraded
            .map((c) => c.commodity?.name)
            .filter(Boolean),
          totalQuantity: Number(stat._sum.totalWeightKg),
          lastTransaction: stat._max.receiptDate,
        };
      })
    );

    res.status(200).json({summary, topTraders});
  } catch (error) {
    return handlePrismaError(res, error);
  }
};
