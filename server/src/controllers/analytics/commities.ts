import {Request, Response} from 'express';
import prisma from '../../utils/database';
import {handlePrismaError} from '../../utils/helpers';
import {Decimal} from '@prisma/client/runtime/library';

//@desc Get analytics for a specific committee
//@route GET /api/analytics/committee/:committeeId
//@access Public
export const getCommitteAnalytics = async (req: Request, res: Response) => {
  const {committeeId} = req.params;

  if (!committeeId) {
    return res.status(400).json({message: 'Committee ID is required.'});
  }

  try {
    // 1. Define the date range for the last 12 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // 2. Fetch all relevant market fee receipts for the committee in the date range
    const receipts = await prisma.receipt.findMany({
      where: {
        committeeId,
        natureOfReceipt: 'mf', // Market Fees
        receiptDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        feesPaid: true,
        receiptDate: true,
        collectionLocation: true,
        officeSupervisor: true,
        checkpostId: true,
        collectionOtherText: true,
        checkpost: {
          select: {
            name: true,
          },
        },
      },
    });

    // 3. Calculate total market fees
    const totalMarketFees = receipts.reduce(
      (sum, receipt) => sum + receipt.feesPaid.toNumber(),
      0
    );

    // Handle case with no receipts to avoid division by zero
    if (totalMarketFees === 0) {
      return res.status(200).json({
        totalMarketFees: 0,
        marketFeesByMonth: [],
        marketFeesByLocation: [],
        locationDrilldown: {
          office: [],
          checkpost: [],
          other: [],
        },
      });
    }

    // 4. Calculate market fees by month (for the line chart)
    const monthlyData: {[key: string]: number} = {};
    const monthFormatter = new Intl.DateTimeFormat('en-US', {month: 'short'});

    // Initialize the last 12 months with 0 fees
    for (let i = 0; i < 12; i++) {
      const month = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
      const monthKey = `${monthFormatter.format(month)} ${month.getFullYear()}`;
      monthlyData[monthKey] = 0;
    }

    receipts.forEach((receipt) => {
      const monthKey = `${monthFormatter.format(
        receipt.receiptDate
      )} ${receipt.receiptDate.getFullYear()}`;
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey] += receipt.feesPaid.toNumber();
      }
    });

    const marketFeesByMonth = Object.entries(monthlyData)
      .map(([date, mf]) => ({date, mf}))
      .reverse(); // Reverse to have the oldest month first

    // 5. Calculate market fees by location and their drilldowns
    const locationTotals = {
      office: 0,
      checkpost: 0,
      other: 0,
    };

    const officeDrilldown: {[key: string]: number} = {};
    const checkpostDrilldown: {[key: string]: number} = {};
    const otherDrilldown: {[key: string]: number} = {};

    receipts.forEach((receipt) => {
      const fees = receipt.feesPaid.toNumber();
      switch (receipt.collectionLocation) {
        case 'office':
          locationTotals.office += fees;
          const supervisor = receipt.officeSupervisor || 'Unknown Supervisor';
          officeDrilldown[supervisor] =
            (officeDrilldown[supervisor] || 0) + fees;
          break;
        case 'checkpost':
          locationTotals.checkpost += fees;
          const checkpostName =
            receipt.checkpost?.name ||
            receipt.checkpostId ||
            'Unknown Checkpost';
          checkpostDrilldown[checkpostName] =
            (checkpostDrilldown[checkpostName] || 0) + fees;
          break;
        case 'other':
          locationTotals.other += fees;
          const otherReason = receipt.collectionOtherText || 'Unspecified';
          otherDrilldown[otherReason] =
            (otherDrilldown[otherReason] || 0) + fees;
          break;
      }
    });

    // 6. Format the location and drilldown data as percentages
    const marketFeesByLocation = [
      {
        name: 'Office',
        value: parseFloat(
          ((locationTotals.office / totalMarketFees) * 100).toFixed(2)
        ),
      },
      {
        name: 'Checkpost',
        value: parseFloat(
          ((locationTotals.checkpost / totalMarketFees) * 100).toFixed(2)
        ),
      },
      {
        name: 'Other',
        value: parseFloat(
          ((locationTotals.other / totalMarketFees) * 100).toFixed(2)
        ),
      },
    ];

    const formatDrilldown = (drilldownData: {[key: string]: number}) =>
      Object.entries(drilldownData).map(([name, value]) => ({
        name,
        value: parseFloat(((value / totalMarketFees) * 100).toFixed(2)),
      }));

    const locationDrilldown = {
      office: formatDrilldown(officeDrilldown),
      checkpost: formatDrilldown(checkpostDrilldown),
      other: formatDrilldown(otherDrilldown),
    };

    // 7. Send the final response
    return res.status(200).json({
      totalMarketFees,
      marketFeesByMonth,
      marketFeesByLocation,
      locationDrilldown,
    });
  } catch (error) {
    console.error('Error fetching committee analytics:', error);
    return handlePrismaError(res, error);
  }
};
