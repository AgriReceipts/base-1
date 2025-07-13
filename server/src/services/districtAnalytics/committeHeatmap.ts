import prisma from '../../utils/database';
import {getFinancialYearRange} from '../../utils/dateHelper';

export const getCommitteeHeatmapData = async ({fyStart}: {fyStart: number}) => {
  // Get financial year range
  const [part1, part2] = getFinancialYearRange(fyStart);

  // Fetch all committee monthly analytics data for the financial year
  const data = await prisma.committeeMonthlyAnalytics.findMany({
    where: {
      OR: [part1, part2],
    },
    select: {
      committeeId: true,
      year: true,
      month: true,
      marketFees: true,
      marketFeeTarget: true,
      committee: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{committeeId: 'asc'}, {year: 'asc'}, {month: 'asc'}],
  });

  // Group data by committee
  const committeeMap = new Map<
    string,
    {
      committeeName: string;
      monthlyData: Record<string, number>;
    }
  >();

  // Month names for mapping
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Financial year months in order (April to March)
  const fyMonths = [
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
  ];

  data.forEach((record) => {
    const committeeId = record.committeeId;
    const committeeName = record.committee?.name || 'Unknown Committee';
    const monthName = monthNames[record.month - 1];

    // Calculate achievement percentage
    const marketFees = record.marketFees?.toNumber() || 0;
    const marketFeeTarget = record.marketFeeTarget?.toNumber() || 0;

    let achievementPercentage = 0;
    if (marketFeeTarget > 0) {
      achievementPercentage = Math.round((marketFees / marketFeeTarget) * 100);
    }

    // Initialize committee data if not exists
    if (!committeeMap.has(committeeId)) {
      committeeMap.set(committeeId, {
        committeeName: committeeName,
        monthlyData: {},
      });
    }

    // Add monthly data
    const committeeData = committeeMap.get(committeeId)!;
    committeeData.monthlyData[monthName] = achievementPercentage;
  });

  // Convert to array format suitable for heatmap
  const heatmapData = Array.from(committeeMap.entries()).map(
    ([committeeId, data]) => {
      // Ensure all months are present with default value of 0
      const monthlyData: Record<string, number> = {};
      fyMonths.forEach((month) => {
        monthlyData[month] = data.monthlyData[month] || 0;
      });

      return {
        committeeId,
        committeeName: data.committeeName,
        ...monthlyData,
      };
    }
  );

  return heatmapData;
};
