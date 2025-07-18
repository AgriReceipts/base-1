import { Request, Response } from "express";
import prisma from "../../utils/database";
import { handlePrismaError } from "../../utils/helpers";

interface ChartData {
  date: string;
  mf: number;
}

// Helper function to get current financial year based on current date
const getCurrentFinancialYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11, so add 1

  // If current month is April (4) or later, FY is current year to next year
  // If current month is before April, FY is previous year to current year
  if (currentMonth >= 4) {
    return {
      startYear: currentYear,
      endYear: currentYear + 1,
    };
  } else {
    return {
      startYear: currentYear - 1,
      endYear: currentYear,
    };
  }
};

// Helper function to get financial year date range
const getFinancialYearRange = (fyStartYear: number) => {
  const startDate = new Date(fyStartYear, 3, 1); // April 1st (month 3 because 0-indexed)
  const endDate = new Date(fyStartYear + 1, 2, 31); // March 31st next year

  return { startDate, endDate };
};

//@desc Get Monthly analytics for a specific committee for a specific month + current FY chart data
//@route GET /api/analytics/committee/:committeeId/:year/:month
//@access Private
export const getCommitteAnalytics = async (req: Request, res: Response) => {
  const { committeeId, year, month } = req.params;
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  if (!committeeId) {
    return res.status(400).json({ message: "Committee ID is required." });
  }

  if (isNaN(yearNum) || isNaN(monthNum)) {
    return res.status(400).json({ error: "Invalid year or month" });
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

    // Get current financial year
    const currentFY = getCurrentFinancialYear();

    // Get current financial year chart data (April to March)
    const chartData = await prisma.committeeMonthlyAnalytics.findMany({
      where: {
        committeeId: committeeId,
        OR: [
          // Data from April to December of FY start year
          {
            year: currentFY.startYear,
            month: { gte: 4 }, // April onwards
          },
          // Data from January to March of FY end year
          {
            year: currentFY.endYear,
            month: { lte: 3 }, // Up to March
          },
        ],
      },
      select: {
        year: true,
        month: true,
        marketFees: true,
      },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });

    // Get current financial year total data
    const currentFYData = await prisma.committeeMonthlyAnalytics.findMany({
      where: {
        committeeId,
        OR: [
          // Data from April to December of FY start year
          {
            year: currentFY.startYear,
            month: { gte: 4 }, // April onwards
          },
          // Data from January to March of FY end year
          {
            year: currentFY.endYear,
            month: { lte: 3 }, // Up to March
          },
        ],
      },
      select: {
        checkpostMarketFees: true,
        officeFees: true,
        otherFees: true,
      },
    });

    let totalCheckpostFees = 0;
    let totalOfficeFees = 0;
    let totalOtherFees = 0;

    for (const entry of currentFYData) {
      totalCheckpostFees += Number(entry.checkpostMarketFees);
      totalOfficeFees += Number(entry.officeFees);
      totalOtherFees += Number(entry.otherFees);
    }

    const totalFees = totalCheckpostFees + totalOfficeFees + totalOtherFees;

    // Format chart data with proper ordering (April to March)
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Sort chart data to ensure April-March order
    const sortedChartData = chartData.sort((a, b) => {
      // Custom sort to put April-March in correct FY order
      const getMonthOrder = (year: number, month: number) => {
        if (year === currentFY.startYear && month >= 4) {
          return month - 4; // April = 0, May = 1, etc.
        } else if (year === currentFY.endYear && month <= 3) {
          return month + 8; // Jan = 9, Feb = 10, Mar = 11
        }
        return month;
      };

      const orderA = getMonthOrder(a.year, a.month);
      const orderB = getMonthOrder(b.year, b.month);

      return orderA - orderB;
    });

    const formattedChartData: ChartData[] = sortedChartData.map((item) => ({
      date: `${monthNames[item.month - 1]} ${item.year}`,
      mf: Number(item.marketFees) || 0,
    }));

    const response = {
      currentMonth: currentData,
      chartData: formattedChartData,
      currentFinancialYear: {
        fyPeriod: `${currentFY.startYear}-${currentFY.endYear}`,
        totalFees,
        totalCheckpostFees,
        totalOfficeFees,
        totalOtherFees,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching committee analytics:", error);
    return handlePrismaError(res, error);
  }
};
