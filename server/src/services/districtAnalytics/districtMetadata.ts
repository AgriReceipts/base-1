import { DistrictMetadata } from "../../types/districtAnalytics";
import prisma from "../../utils/database";
import { getFinancialYearRange } from "../../utils/dateHelper";

export const districtMetadata = async ({
  fyStart,
  month,
}: {
  fyStart: number;
  month?: number;
}): Promise<DistrictMetadata> => {
  let data;
  if (month) {
    const targetYear = month >= 4 ? fyStart : fyStart + 1;

    data = await prisma.committeeMonthlyAnalytics.findMany({
      where: {
        year: targetYear,
        month,
      },
      select: {
        marketFees: true,
        marketFeeTarget: true,
        totalReceipts: true,
        totalValue: true,
      },
    });
  } else {
    const [part1, part2] = getFinancialYearRange(fyStart);

    data = await prisma.committeeMonthlyAnalytics.findMany({
      where: {
        OR: [part1, part2],
      },
      select: {
        marketFees: true,
        marketFeeTarget: true,
        totalReceipts: true,
        totalValue: true,
      },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });
  }

  let totalMarketFees = 0;
  let totalReceipts = 0;
  let totalTarget = 0;
  let totalValue = 0;

  data.forEach((entry) => {
    totalMarketFees += Number(entry.marketFees || 0);
    totalReceipts += entry.totalReceipts || 0;
    totalTarget += Number(entry.marketFeeTarget || 0);
    totalValue += Number(entry.totalValue || 0);
  });

  const avgTransaction =
    totalReceipts > 0 ? totalMarketFees / totalReceipts : 0;

  const achievementPercent =
    totalTarget > 0 ? (totalMarketFees / totalTarget) * 100 : null;

  return {
    totalMarketFees,
    totalReceipts,
    avgTransaction,
    totalTarget: totalTarget || null,
    achievementPercent: achievementPercent
      ? +achievementPercent.toFixed(2)
      : null,
  };
};
