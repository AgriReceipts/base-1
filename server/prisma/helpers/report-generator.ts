import {PrismaClient, ReportLevel} from '@prisma/client';

export async function generateMonthlyReports(
  prisma: PrismaClient,
  config: any
): Promise<void> {
  console.log('   Generating monthly reports from existing data...');

  // Get all distinct committee/year/month combinations from CommitteeMonthlyAnalytics
  const analyticsData = await prisma.committeeMonthlyAnalytics.findMany({
    select: {
      committeeId: true,
      year: true,
      month: true,
      totalReceipts: true,
      totalValue: true,
      totalFeesPaid: true,
      marketFees: true,
      officeFees: true,
      checkpostFees: true,
      otherFees: true,
      uniqueTraders: true,
      uniqueCommodities: true,
    },
    orderBy: [{year: 'asc'}, {month: 'asc'}, {committeeId: 'asc'}],
  });

  console.log(
    `     Found ${analyticsData.length} committee/month combinations to process`
  );

  const reports = [];

  for (const analytics of analyticsData) {
    const {committeeId, year, month} = analytics;

    // Get the corresponding target (if exists)
    const target = await prisma.target.findFirst({
      where: {
        committeeId,
        year,
        month,
        isActive: true,
      },
    });

    // Get previous year same month data for comparison
    const prevYearAnalytics = await prisma.committeeMonthlyAnalytics.findFirst({
      where: {
        committeeId,
        year: year - 1,
        month,
      },
    });

    // Calculate cumulative data up to this month
    const cumulativeAnalytics = await prisma.committeeMonthlyAnalytics.findMany(
      {
        where: {
          committeeId,
          year,
          month: {lte: month},
        },
      }
    );

    const cumulativeTotals = cumulativeAnalytics.reduce(
      (acc, curr) => ({
        totalReceipts: acc.totalReceipts + curr.totalReceipts,
        totalValue: acc.totalValue + parseFloat(curr.totalValue.toString()),
        totalFeesPaid:
          acc.totalFeesPaid + parseFloat(curr.totalFeesPaid.toString()),
        marketFees: acc.marketFees + parseFloat(curr.marketFees.toString()),
      }),
      {totalReceipts: 0, totalValue: 0, totalFeesPaid: 0, marketFees: 0}
    );

    // Calculate cumulative target (sum of all targets up to this month)
    const cumulativeTargets = await prisma.target.findMany({
      where: {
        committeeId,
        year,
        month: {lte: month},
        isActive: true,
      },
    });

    const cumulativeTarget = cumulativeTargets.reduce(
      (sum, t) => sum + parseFloat(t.marketFeeTarget.toString()),
      0
    );

    // Calculate performance metrics
    const monthlyTarget = target
      ? parseFloat(target.marketFeeTarget.toString())
      : null;
    const monthlyAchievement = parseFloat(analytics.marketFees.toString());
    const cumulativeAchievement = cumulativeTotals.marketFees;

    const monthlyVariance =
      monthlyTarget !== null ? monthlyAchievement - monthlyTarget : null;
    const cumulativeVariance =
      cumulativeTarget > 0 ? cumulativeAchievement - cumulativeTarget : null;
    const achievementPercent =
      cumulativeTarget > 0
        ? (cumulativeAchievement / cumulativeTarget) * 100
        : null;

    const prevYearSameMonth = prevYearAnalytics
      ? parseFloat(prevYearAnalytics.marketFees.toString())
      : null;
    const yearOnYearGrowth =
      prevYearSameMonth !== null && prevYearSameMonth > 0
        ? ((monthlyAchievement - prevYearSameMonth) / prevYearSameMonth) * 100
        : null;

    // Calculate additional metrics
    const avgReceiptValue =
      analytics.totalReceipts > 0
        ? parseFloat(analytics.totalValue.toString()) / analytics.totalReceipts
        : 0;
    const avgFeeRate =
      parseFloat(analytics.totalValue.toString()) > 0
        ? (parseFloat(analytics.totalFeesPaid.toString()) /
            parseFloat(analytics.totalValue.toString())) *
          100
        : 0;

    // Get committee details for report slug
    const committee = await prisma.committee.findUnique({
      where: {id: committeeId},
      select: {name: true},
    });

    const reportSlug = `${committee?.name
      .toLowerCase()
      .replace(/\s+/g, '-')}-${year}-${month.toString().padStart(2, '0')}`;

    const reportData = {
      reportSlug,
      year,
      month,
      committeeId,
      checkpostId: null, // Committee-level reports don't have checkpost
      reportLevel: ReportLevel.committee,
      totalReceipts: analytics.totalReceipts,
      totalValue: parseFloat(analytics.totalValue.toString()),
      totalFeesPaid: parseFloat(analytics.totalFeesPaid.toString()),
      totalQuantity: 0, // We don't have this aggregated, would need to calculate from receipts
      monthlyTarget,
      cumulativeTarget: cumulativeTarget > 0 ? cumulativeTarget : null,
      monthlyAchievement,
      cumulativeAchievement,
      monthlyVariance,
      cumulativeVariance,
      achievementPercent,
      prevYearSameMonth,
      yearOnYearGrowth,
      mf_fees: parseFloat(analytics.marketFees.toString()),
      lc_fees: 0, // These would need to be calculated from the analytics breakdown
      uc_fees: 0, // These would need to be calculated from the analytics breakdown
      others_fees: parseFloat(analytics.otherFees.toString()),
    };

    reports.push(reportData);
  }
}
