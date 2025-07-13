import prisma from '../../utils/database';
import {getFinancialYearRange} from '../../utils/dateHelper';

export const getTopCommodities = async ({
  fyStart,
  month,
}: {
  fyStart: number;
  month?: number;
}) => {
  let data;

  if (month) {
    // For specific month
    const targetYear = month >= 4 ? fyStart : fyStart + 1;
    data = await prisma.commodityMonthlyAnalytics.groupBy({
      by: ['commodityId'],
      where: {
        year: targetYear,
        month: month,
      },
      _sum: {
        totalFeesPaid: true,
      },
      orderBy: {
        _sum: {
          totalFeesPaid: 'desc',
        },
      },
      // Fetch all results to calculate "Others" category
    });
  } else {
    // For entire financial year
    const [part1, part2] = getFinancialYearRange(fyStart);
    data = await prisma.commodityMonthlyAnalytics.groupBy({
      by: ['commodityId'],
      where: {
        OR: [part1, part2],
      },
      _sum: {
        totalFeesPaid: true,
      },
      orderBy: {
        _sum: {
          totalFeesPaid: 'desc',
        },
      },
      // Fetch all results to calculate "Others" category
    });
  }

  // Get commodity names for top 7
  const top7Data = data.slice(0, 7);
  const remainingData = data.slice(7);

  const top7WithNames = await Promise.all(
    top7Data.map(async (item) => {
      const commodity = await prisma.commodity.findUnique({
        where: {
          id: item.commodityId,
        },
        select: {
          name: true,
        },
      });
      return {
        commodityName: commodity?.name || 'Unknown',
        totalFeesPaid: item._sum.totalFeesPaid?.toNumber() || 0,
      };
    })
  );

  // Calculate "Others" total
  const othersTotal = remainingData.reduce((sum, item) => {
    return sum + (item._sum.totalFeesPaid?.toNumber() || 0);
  }, 0);

  // Combine results
  const result = [...top7WithNames];

  // Add "Others" category only if there are remaining commodities
  if (remainingData.length > 0) {
    result.push({
      commodityName: 'Others',
      totalFeesPaid: othersTotal,
    });
  }

  return result;
};
