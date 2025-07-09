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
  const year = receiptDate.getFullYear();
  const month = receiptDate.getMonth() + 1;
  const day = new Date(
    receiptDate.getFullYear(),
    receiptDate.getMonth(),
    receiptDate.getDate()
  );

  // 1. UPDATE DAILY ANALYTICS (This part is correct)
  await tx.dailyAnalytics.update({
    where: {
      receiptDate_committeeId: {
        receiptDate: day,
        committeeId,
      },
    },
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: value},
      totalFeesPaid: {decrement: feesPaid},
      totalQuantity: {decrement: totalWeightKg},
      [`${natureOfReceipt}_fees`]: {decrement: feesPaid},
      [`${collectionLocation}Fees`]: {decrement: feesPaid},
    },
  });

  // 2. UPDATE TRADER MONTHLY & OVERALL ANALYTICS (CORRECTED)
  // Decrement from the monthly record
  await tx.traderMonthlyAnalytics.update({
    where: {
      traderId_committeeId_year_month: {
        traderId,
        committeeId,
        year,
        month,
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
        traderId,
        committeeId,
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
          commodityId,
          committeeId,
          year,
          month,
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
          commodityId,
          committeeId,
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

  // 4. UPDATE COMMITTEE MONTHLY ANALYTICS (This part is correct)
  const monthlyUpdatePayload: Prisma.CommitteeMonthlyAnalyticsUpdateInput = {
    totalReceipts: {decrement: 1},
    totalValue: {decrement: value},
    totalFeesPaid: {decrement: feesPaid},
    [`${collectionLocation}Fees`]: {decrement: feesPaid},
  };

  if (natureOfReceipt === 'mf') {
    monthlyUpdatePayload.marketFees = {decrement: feesPaid};
  }

  await tx.committeeMonthlyAnalytics.update({
    where: {committeeId_year_month: {committeeId, year, month}},
    data: monthlyUpdatePayload,
  });
};
