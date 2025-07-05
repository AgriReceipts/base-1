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
    checkpostId,
  }: AnalyticsInput
) => {
  const year = receiptDate.getFullYear();
  const month = receiptDate.getMonth() + 1;
  // Normalize date to the start of the day for daily analytics consistency
  const day = new Date(
    receiptDate.getFullYear(),
    receiptDate.getMonth(),
    receiptDate.getDate()
  );

  // 1. UPDATE DAILY ANALYTICS
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
      // Dynamic updates for fee nature and location breakdowns
      [`${natureOfReceipt}_fees`]: {decrement: feesPaid},
      [`${collectionLocation}Fees`]: {decrement: feesPaid},
    },
  });

  // 2. UPDATE TRADER ANALYTICS
  await tx.traderAnalytics.update({
    where: {
      traderId_committeeId_receiptDate: {
        traderId,
        committeeId,
        receiptDate: day,
      },
    },
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: value},
      totalFeesPaid: {decrement: feesPaid},
      totalQuantity: {decrement: totalWeightKg},
    },
  });

  // 3. UPDATE COMMODITY ANALYTICS
  if (commodityId) {
    await tx.commodityAnalytics.update({
      where: {
        commodityId_committeeId_receiptDate: {
          commodityId,
          committeeId,
          receiptDate: day,
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

  // 4. UPDATE COMMITTEE MONTHLY ANALYTICS
  const monthlyUpdatePayload: Prisma.CommitteeMonthlyAnalyticsUpdateInput = {
    totalReceipts: {decrement: 1},
    totalValue: {decrement: value},
    totalFeesPaid: {decrement: feesPaid},
    // Dynamic location-based fee decrement
    [`${collectionLocation}Fees`]: {decrement: feesPaid},
  };

  // Only decrement marketFees if the receipt was actually a market fee
  if (natureOfReceipt === 'mf') {
    monthlyUpdatePayload.marketFees = {decrement: feesPaid};
  }

  await tx.committeeMonthlyAnalytics.update({
    where: {committeeId_year_month: {committeeId, year, month}},
    data: monthlyUpdatePayload,
  });
};
