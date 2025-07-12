import prisma from '../../utils/database';
import {getFinancialYearRange} from '../../utils/dateHelper';

const getStatus = (
  achievementPercentage: number,
  expectedPercentage: number,
  hasTarget: boolean,
  isCurrentMonth: boolean = false
) => {
  // No target set
  if (!hasTarget) return 'No Target';

  // For current month, consider time elapsed
  if (isCurrentMonth) {
    const tolerance = 10; // 10% tolerance for current month

    if (achievementPercentage >= expectedPercentage - tolerance) {
      return 'On Track';
    } else if (achievementPercentage >= expectedPercentage * 0.7) {
      return 'Lagging';
    } else {
      return 'Critical';
    }
  }

  // For completed months or yearly view
  if (achievementPercentage >= 100) return 'Met';
  if (achievementPercentage >= 90) return 'On Track';
  if (achievementPercentage >= 70) return 'Lagging';
  if (achievementPercentage >= 50) return 'Critical';
  return 'Not Met';
};

const getCurrentFinancialMonth = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  return currentMonth >= 4 ? currentMonth : currentMonth + 12;
};

const getExpectedPercentageForCurrentMonth = (month: number) => {
  const now = new Date();
  const currentDate = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();

  // If it's the same month, calculate based on days elapsed
  const currentFYMonth = getCurrentFinancialMonth();
  if (month === currentFYMonth) {
    return Math.round((currentDate / daysInMonth) * 100);
  }

  // For past months, expect 100%
  return 100;
};

const getExpectedPercentageForYear = (fyStart: number) => {
  const now = new Date();
  const currentFYMonth = getCurrentFinancialMonth();
  const currentDate = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();

  // Calculate months completed + partial current month
  const monthsCompleted = currentFYMonth - 4; // April is month 4, so subtract 4
  const currentMonthProgress = currentDate / daysInMonth;
  const totalProgress = (monthsCompleted + currentMonthProgress) / 12;

  return Math.round(totalProgress * 100);
};

export const committeWiseAcheivement = async ({
  fyStart,
  month,
}: {
  fyStart: number;
  month?: number;
}) => {
  const currentFYMonth = getCurrentFinancialMonth();

  if (month) {
    const targetYear = month >= 4 ? fyStart : fyStart + 1;
    const data = await prisma.committeeMonthlyAnalytics.findMany({
      where: {
        year: targetYear,
        month: month,
      },
      select: {
        marketFees: true,
        marketFeeTarget: true,
        totalReceipts: true,
        committee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const expectedPercentage = getExpectedPercentageForCurrentMonth(month);

    return data.map((entry) => {
      const hasTarget = Boolean(
        entry.marketFeeTarget && entry.marketFeeTarget.toNumber() > 0
      );
      const achievementPercentage = hasTarget
        ? Math.round(
            (entry.marketFees.toNumber() / entry.marketFeeTarget!.toNumber()) *
              100
          )
        : 0;

      const isCurrentMonth = month === currentFYMonth;

      return {
        committeId: entry.committee.id,
        committeName: entry.committee.name,
        marketFees: entry.marketFees,
        target: entry.marketFeeTarget,
        totalReceipts: entry.totalReceipts,
        achievementPercentage: hasTarget ? achievementPercentage : null,
        expectedPercentage: isCurrentMonth ? expectedPercentage : 100,
        status: getStatus(
          achievementPercentage,
          expectedPercentage,
          hasTarget,
          isCurrentMonth
        ),
        isCurrentMonth,
      };
    });
  } else {
    const [part1, part2] = getFinancialYearRange(fyStart);
    const data = await prisma.committeeMonthlyAnalytics.groupBy({
      by: ['committeeId'],
      where: {
        OR: [part1, part2],
      },
      _sum: {
        marketFees: true,
        marketFeeTarget: true,
        totalReceipts: true,
      },
    });

    const expectedPercentage = getExpectedPercentageForYear(fyStart);

    const resultWithNames = await Promise.all(
      data.map(async (item) => {
        const committe = await prisma.committee.findUnique({
          where: {
            id: item.committeeId,
          },
          select: {
            id: true,
            name: true,
          },
        });

        const hasTarget = Boolean(
          item._sum.marketFeeTarget && item._sum.marketFeeTarget.toNumber() > 0
        );
        const achievementPercentage = hasTarget
          ? Math.round(
              (item._sum.marketFees!.toNumber() /
                item._sum.marketFeeTarget!.toNumber()) *
                100
            )
          : 0;

        return {
          committeId: committe?.id,
          committeName: committe?.name,
          marketFees: item._sum.marketFees?.toNumber() || 0,
          marketFeesTarget: item._sum.marketFeeTarget?.toNumber() || 0,
          totalReceipts: item._sum.totalReceipts || 0,
          achievementPercentage: hasTarget ? achievementPercentage : null,
          expectedPercentage,
          status: getStatus(
            achievementPercentage,
            expectedPercentage,
            hasTarget,
            false
          ),
          isCurrentMonth: false,
        };
      })
    );

    return resultWithNames;
  }
};
