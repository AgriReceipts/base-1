import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';

interface ChartData {
  date: string;
  mf: number;
}

//@desc Get Monthly analytics for a specific committee for a specific month + 12 months chart data
//@route GET /api/analytics/committee/:committeeId/:year/:month
//@access Private
export const getCommitteAnalytics = async (req: Request, res: Response) => {
  const {committeeId, year, month} = req.params;

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  if (!committeeId) {
    return res.status(400).json({message: 'Committee ID is required.'});
  }

  if (isNaN(yearNum) || isNaN(monthNum)) {
    return res.status(400).json({error: 'Invalid year or month'});
  }

  try {
    // Get current month data
    const currentData = await prisma.committeeMonthlyAnalytics.findUnique({
      where: {
        committeeId_year_month: {
          committeeId: committeeId,
          year: yearNum,
          month: monthNum,
        },
      },
      select: {
        totalValue: true,
        marketFees: true,
        officeFees: true,
        checkpostMarketFees: true,
        otherFees: true,
      },
    });

    // Calculate date range for last 12 months from current month
    const endDate = new Date(yearNum, monthNum - 1); // monthNum - 1 because Date month is 0-indexed
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 11); // 11 months back + current month = 12 months

    // Get 12 months of market fees data for visual chart
    const chartData = await prisma.committeeMonthlyAnalytics.findMany({
      where: {
        committeeId: committeeId,
        OR: [
          {
            year: {gte: startDate.getFullYear()},
            month: {gte: startDate.getMonth() + 1},
          },
          {
            year: {lte: endDate.getFullYear()},
            month: {lte: endDate.getMonth() + 1},
          },
        ],
      },
      select: {
        year: true,
        month: true,
        marketFees: true,
      },
      orderBy: [{year: 'asc'}, {month: 'asc'}],
    });

    //Get all time data

    const allTimeMfCollection = await prisma.committeeMonthlyAnalytics.findMany(
      {
        where: {
          committeeId,
        },
        select: {
          checkpostMarketFees: true,
          officeFees: true,
          otherFees: true,
        },
      }
    );
    let totalCheckpostFees = 0;
    let totalOfficeFees = 0;
    let totalOtherFees = 0;

    for (const entry of allTimeMfCollection) {
      totalCheckpostFees += Number(entry.checkpostMarketFees);
      totalOfficeFees += Number(entry.officeFees);
      totalOtherFees += Number(entry.otherFees);
    }

    const totalFees = totalCheckpostFees + totalOfficeFees + totalOtherFees;

    // Format chart data
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const formattedChartData: ChartData[] = chartData.map((item) => ({
      date: `${monthNames[item.month - 1]} ${item.year}`,
      mf: Number(item.marketFees) || 0,
    }));

    const response = {
      currentMonth: currentData,
      chartData: formattedChartData,
      allTime: {
        totalFees,
        totalCheckpostFees,
        totalOfficeFees,
        totalOtherFees,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching committee analytics:', error);
    return handlePrismaError(res, error);
  }
};

//Todo
// /api/analytics/committee/:id/:year/:month/drilldown that does basic aggregation from receipts table. Return only the essential fields you need.
