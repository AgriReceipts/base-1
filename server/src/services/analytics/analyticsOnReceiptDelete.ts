import {Prisma} from '@prisma/client';
import {AnalyticsInput} from '../../types/analytics';

export const updateAnalyticsOnReceiptDelete = async (
  tx: Prisma.TransactionClient,
  {
    committeeId,
    traderId,
    commodityId,
    receiptDate,
    value,
    feesPaid,
    totalWeightKg,
    natureOfReceipt,
    collectionLocation,
  }: // checkpostId is not used in the decrement logic but kept for interface consistency
  AnalyticsInput
) => {
  const oldDay = new Date(
    receiptDate.getFullYear(),
    receiptDate.getMonth(),
    receiptDate.getDate()
  );

  // Fix: Correct date calculations
  const oldYear = receiptDate.getFullYear();
  const oldMonth = receiptDate.getMonth() + 1;

  // 1. Revert Daily Analytics
  // FIX: Check if the daily analytics record exists before trying to update
  const existingDailyAnalytics = await tx.dailyAnalytics.findUnique({
    where: {
      receiptDate_committeeId: {
        receiptDate: oldDay,
        committeeId: committeeId,
      },
    },
  });

  if (existingDailyAnalytics) {
    const dailyUpdatePayload: Prisma.DailyAnalyticsUpdateInput = {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: value},
      totalQuantity: {decrement: totalWeightKg},
    };

    if (natureOfReceipt === 'mf') {
      dailyUpdatePayload.marketFees = {decrement: feesPaid};

      if (collectionLocation === 'office') {
        dailyUpdatePayload.officeFees = {decrement: feesPaid};
      } else if (collectionLocation === 'checkpost') {
        dailyUpdatePayload.checkpostFees = {decrement: feesPaid};
      } else if (collectionLocation === 'other') {
        dailyUpdatePayload.otherFees = {decrement: feesPaid};
      }
    }

    await tx.dailyAnalytics.update({
      where: {
        receiptDate_committeeId: {
          receiptDate: oldDay,
          committeeId: committeeId,
        },
      },
      data: dailyUpdatePayload,
    });
  }

  // 2. UPDATE TRADER MONTHLY & OVERALL ANALYTICS (CORRECTED)
  // Decrement from the monthly record
  await tx.traderMonthlyAnalytics.update({
    where: {
      traderId_committeeId_year_month: {
        traderId: traderId,
        committeeId: committeeId,
        year: oldYear,
        month: oldMonth,
      },
    },
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: value},
      totalFeesPaid: {decrement: feesPaid},
      totalQuantity: {decrement: totalWeightKg},
    },
  });

  // Decrement from the overall record
  await tx.traderOverallAnalytics.update({
    where: {
      traderId_committeeId: {
        traderId: traderId,
        committeeId: committeeId,
      },
    },
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: value},
      totalFeesPaid: {decrement: feesPaid},
      totalQuantity: {decrement: totalWeightKg},
    },
  });

  // 3. UPDATE COMMODITY MONTHLY & OVERALL ANALYTICS (CORRECTED)
  if (commodityId) {
    // Decrement from the monthly record
    await tx.commodityMonthlyAnalytics.update({
      where: {
        commodityId_committeeId_year_month: {
          commodityId: commodityId,
          committeeId: committeeId,
          year: oldYear,
          month: oldMonth,
        },
      },
      data: {
        totalReceipts: {decrement: 1},
        totalValue: {decrement: value},
        totalFeesPaid: {decrement: feesPaid},
        totalQuantity: {decrement: totalWeightKg},
      },
    });

    // Decrement from the overall record
    await tx.commodityOverallAnalytics.update({
      where: {
        commodityId_committeeId: {
          commodityId: commodityId,
          committeeId: committeeId,
        },
      },
      data: {
        totalReceipts: {decrement: 1},
        totalValue: {decrement: value},
        totalFeesPaid: {decrement: feesPaid},
        totalQuantity: {decrement: totalWeightKg},
      },
    });
  }

  // 4. Update Committee Monthly Analytics
  // Fix: Create proper update payload with conditional logic
  const monthlyUpdatePayload: Prisma.CommitteeMonthlyAnalyticsUpdateInput = {
    totalReceipts: {decrement: 1},
    totalValue: {decrement: value},
  };

  // Only decrement marketFees if the old receipt was actually a market fee
  if (natureOfReceipt === 'mf') {
    monthlyUpdatePayload.marketFees = {decrement: feesPaid};

    if (collectionLocation === 'office') {
      monthlyUpdatePayload.officeFees = {decrement: feesPaid};
    } else if (collectionLocation === 'checkpost') {
      monthlyUpdatePayload.checkpostMarketFees = {decrement: feesPaid};
    } else if (collectionLocation === 'other') {
      // FIX: This was incorrectly set to officeFees instead of otherFees
      monthlyUpdatePayload.otherFees = {decrement: feesPaid};
    }
  }

  await tx.committeeMonthlyAnalytics.update({
    where: {
      committeeId_year_month: {
        committeeId: committeeId,
        year: oldYear,
        month: oldMonth,
      },
    },
    data: monthlyUpdatePayload,
  });
};
