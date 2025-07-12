import prisma from '../../utils/database';
import {getFinancialYearRange} from '../../utils/dateHelper';

export const topCheckposts = async ({
  fyStart,
  month,
}: {
  fyStart: number;
  month?: number;
}) => {
  if (month) {
    const targetYear = month >= 4 ? fyStart : fyStart + 1;

    const data = await prisma.committeeMonthlyAnalytics.findMany({
      where: {
        year: targetYear,
        month: month,
        checkPostId: {
          not: null,
        },
      },
      select: {
        checkPostId: true,
        checkpostFees: true,
        Checkpost: {
          select: {
            name: true,
          },
        },
      },
    });

    const feesByCheckpost: Record<string, number> = {};

    data.forEach((entry) => {
      const name = entry.Checkpost?.name || 'Unknown';
      const fee = Number(entry.checkpostFees || 0);
      feesByCheckpost[name] = (feesByCheckpost[name] || 0) + fee;
    });

    const result = Object.entries(feesByCheckpost)
      .map(([name, totalFees]) => ({
        name,
        totalFees,
      }))
      .sort((a, b) => b.totalFees - a.totalFees);

    return result;
  } else {
    const [part1, part2] = getFinancialYearRange(fyStart);

    const data = await prisma.committeeMonthlyAnalytics.findMany({
      where: {
        OR: [part1, part2],
        checkPostId: {
          not: null,
        },
      },
      select: {
        checkPostId: true,
        checkpostFees: true,
        Checkpost: {
          select: {
            name: true,
          },
        },
      },
    });

    const feesByCheckpost: Record<string, number> = {};

    data.forEach((entry) => {
      const name = entry.Checkpost?.name || 'Unknown';
      const fee = Number(entry.checkpostFees || 0);
      feesByCheckpost[name] = (feesByCheckpost[name] || 0) + fee;
    });

    const result = Object.entries(feesByCheckpost)
      .map(([name, totalFees]) => ({
        name,
        totalFees,
      }))
      .sort((a, b) => b.totalFees - a.totalFees);

    return result;
  }
};
