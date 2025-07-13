import prisma from '../../utils/database';
import {getFinancialYearRange} from '../../utils/dateHelper';

export const getCommitteeDoubleBarChartData = async ({
  comparisonFyStart,
}: {
  comparisonFyStart: number;
}) => {
  // Get financial year ranges for both years
  const date = new Date();
  const currentYear = date.getFullYear();

  const [currentYearPart1, currentYearPart2] =
    getFinancialYearRange(currentYear);
  const [comparisonYearPart1, comparisonYearPart2] =
    getFinancialYearRange(comparisonFyStart);

  // Fetch data for current financial year
  const currentYearData = await prisma.committeeMonthlyAnalytics.groupBy({
    by: ['year', 'month'],
    where: {
      OR: [currentYearPart1, currentYearPart2],
    },
    _sum: {
      marketFees: true,
    },
    orderBy: [{year: 'asc'}, {month: 'asc'}],
  });

  // Fetch data for comparison financial year
  const comparisonYearData = await prisma.committeeMonthlyAnalytics.groupBy({
    by: ['year', 'month'],
    where: {
      OR: [comparisonYearPart1, comparisonYearPart2],
    },
    _sum: {
      marketFees: true,
    },
    orderBy: [{year: 'asc'}, {month: 'asc'}],
  });

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
    {name: 'April', number: 4},
    {name: 'May', number: 5},
    {name: 'June', number: 6},
    {name: 'July', number: 7},
    {name: 'August', number: 8},
    {name: 'September', number: 9},
    {name: 'October', number: 10},
    {name: 'November', number: 11},
    {name: 'December', number: 12},
    {name: 'January', number: 1},
    {name: 'February', number: 2},
    {name: 'March', number: 3},
  ];

  // Create maps for quick lookup
  const currentYearMap = new Map<string, number>();
  const comparisonYearMap = new Map<string, number>();

  // Process current year data
  currentYearData.forEach((record) => {
    const monthName = monthNames[record.month - 1];
    const marketFees = record._sum.marketFees?.toNumber() || 0;

    if (currentYearMap.has(monthName)) {
      currentYearMap.set(
        monthName,
        currentYearMap.get(monthName)! + marketFees
      );
    } else {
      currentYearMap.set(monthName, marketFees);
    }
  });

  // Process comparison year data
  comparisonYearData.forEach((record) => {
    const monthName = monthNames[record.month - 1];
    const marketFees = record._sum.marketFees?.toNumber() || 0;

    if (comparisonYearMap.has(monthName)) {
      comparisonYearMap.set(
        monthName,
        comparisonYearMap.get(monthName)! + marketFees
      );
    } else {
      comparisonYearMap.set(monthName, marketFees);
    }
  });

  // Build chart data
  const chartData = fyMonths.map((month) => {
    const currentYearValue = currentYearMap.get(month.name) || 0;
    const comparisonYearValue = comparisonYearMap.get(month.name) || 0;

    return {
      month: month.name,
      monthNumber: month.number,
      [`FY${currentYear}-${currentYear + 1}`]: currentYearValue,
      [`FY${comparisonFyStart}-${comparisonFyStart + 1}`]: comparisonYearValue,
      currentYear: currentYearValue,
      comparisonYear: comparisonYearValue,
    };
  });

  return {
    data: chartData,
    labels: {
      currentYear: `FY${currentYear}-${currentYear + 1}`,
      comparisonYear: `FY${comparisonFyStart}-${comparisonFyStart + 1}`,
    },
    totals: {
      currentYear: chartData.reduce((sum, item) => sum + item.currentYear, 0),
      comparisonYear: chartData.reduce(
        (sum, item) => sum + item.comparisonYear,
        0
      ),
    },
  };
};
