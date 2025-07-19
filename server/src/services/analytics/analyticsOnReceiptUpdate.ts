import {Prisma} from '@prisma/client';
import {AnalyticsInput} from '../../types/analytics';
import {updateAnalyticsOnReceiptCreate} from './analyticsOnReceiptCreate';

type ReceiptAnalyticsUpdateInput = {
  old: AnalyticsInput;
  new: AnalyticsInput;
};

export const updateAnalyticsOnReceiptUpdate = async (
  tx: Prisma.TransactionClient,
  {old, new: updated}: ReceiptAnalyticsUpdateInput
) => {
  const oldDay = new Date(
    old.receiptDate.getFullYear(),
    old.receiptDate.getMonth(),
    old.receiptDate.getDate()
  );

  // Fix: Correct date calculations
  const oldYear = old.receiptDate.getFullYear();
  const oldMonth = old.receiptDate.getMonth() + 1;

  // 1. Revert Daily Analytics
  // FIX: Check if the daily analytics record exists before trying to update
  const existingDailyAnalytics = await tx.dailyAnalytics.findUnique({
    where: {
      receiptDate_committeeId: {
        receiptDate: oldDay,
        committeeId: old.committeeId,
      },
    },
  });

  if (existingDailyAnalytics) {
    const dailyUpdatePayload: Prisma.DailyAnalyticsUpdateInput = {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: old.value},
      totalQuantity: {decrement: old.totalWeightKg},
    };

    if (old.natureOfReceipt === 'mf') {
      dailyUpdatePayload.marketFees = {decrement: old.feesPaid};

      if (old.collectionLocation === 'office') {
        dailyUpdatePayload.officeFees = {decrement: old.feesPaid};
      } else if (old.collectionLocation === 'checkpost') {
        dailyUpdatePayload.checkpostFees = {decrement: old.feesPaid};
      } else if (old.collectionLocation === 'other') {
        dailyUpdatePayload.otherFees = {decrement: old.feesPaid};
      }
    }

    await tx.dailyAnalytics.update({
      where: {
        receiptDate_committeeId: {
          receiptDate: oldDay,
          committeeId: old.committeeId,
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
        traderId: old.traderId,
        committeeId: old.committeeId,
        year: oldYear,
        month: oldMonth,
      },
    },
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: old.value},
      totalFeesPaid: {decrement: old.feesPaid},
      totalQuantity: {decrement: old.totalWeightKg},
    },
  });

  // Decrement from the overall record
  await tx.traderOverallAnalytics.update({
    where: {
      traderId_committeeId: {
        traderId: old.traderId,
        committeeId: old.committeeId,
      },
    },
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: old.value},
      totalFeesPaid: {decrement: old.feesPaid},
      totalQuantity: {decrement: old.totalWeightKg},
    },
  });

  // 3. UPDATE COMMODITY MONTHLY & OVERALL ANALYTICS (CORRECTED)
  if (old.commodityId) {
    // Decrement from the monthly record
    await tx.commodityMonthlyAnalytics.update({
      where: {
        commodityId_committeeId_year_month: {
          commodityId: old.commodityId,
          committeeId: old.committeeId,
          year: oldYear,
          month: oldMonth,
        },
      },
      data: {
        totalReceipts: {decrement: 1},
        totalValue: {decrement: old.value},
        totalFeesPaid: {decrement: old.feesPaid},
        totalQuantity: {decrement: old.totalWeightKg},
      },
    });

    // Decrement from the overall record
    await tx.commodityOverallAnalytics.update({
      where: {
        commodityId_committeeId: {
          commodityId: old.commodityId,
          committeeId: old.committeeId,
        },
      },
      data: {
        totalReceipts: {decrement: 1},
        totalValue: {decrement: old.value},
        totalFeesPaid: {decrement: old.feesPaid},
        totalQuantity: {decrement: old.totalWeightKg},
      },
    });
  }

  // 4. Update Committee Monthly Analytics
  // Fix: Create proper update payload with conditional logic
  const monthlyUpdatePayload: Prisma.CommitteeMonthlyAnalyticsUpdateInput = {
    totalReceipts: {decrement: 1},
    totalValue: {decrement: old.value},
  };

  // Only decrement marketFees if the old receipt was actually a market fee
  if (old.natureOfReceipt === 'mf') {
    monthlyUpdatePayload.marketFees = {decrement: old.feesPaid};

    if (old.collectionLocation === 'office') {
      monthlyUpdatePayload.officeFees = {decrement: old.feesPaid};
    } else if (old.collectionLocation === 'checkpost') {
      monthlyUpdatePayload.checkpostMarketFees = {decrement: old.feesPaid};
    } else if (old.collectionLocation === 'other') {
      // FIX: This was incorrectly set to officeFees instead of otherFees
      monthlyUpdatePayload.otherFees = {decrement: old.feesPaid};
    }
  }

  await tx.committeeMonthlyAnalytics.update({
    where: {
      committeeId_year_month: {
        committeeId: old.committeeId,
        year: oldYear,
        month: oldMonth,
      },
    },
    data: monthlyUpdatePayload,
  });

  // 5. Apply NEW values
  await updateAnalyticsOnReceiptCreate(tx, updated);
};
