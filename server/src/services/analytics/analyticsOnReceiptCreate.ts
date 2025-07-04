import {Prisma} from '@prisma/client';
import {AnalyticsInput} from '../../types/analytics';

export const updateAnalyticsOnReceiptCreate = async (
  tx: Prisma.TransactionClient,
  {
    committeeId,
    traderId,
    commodityId,
    receiptDate,
    value,
    feesPaid,
    totalWeightKg,
  }: AnalyticsInput
) => {
  const year = receiptDate.getFullYear();
  const month = receiptDate.getMonth() + 1;

  // Update TraderAnalytics
  await tx.traderAnalytics.upsert({
    where: {traderId_committeeId: {traderId, committeeId}},
    update: {
      totalReceipts: {increment: 1},
      totalValue: {increment: value},
      totalFeesPaid: {increment: feesPaid},
      totalQuantity: {increment: totalWeightKg},
      lastTransactionDate: receiptDate,
    },
    create: {
      traderId,
      committeeId,
      totalReceipts: 1,
      totalValue: value,
      totalFeesPaid: feesPaid,
      totalQuantity: totalWeightKg,
      firstTransactionDate: receiptDate,
      lastTransactionDate: receiptDate,
    },
  });

  // Update CommodityAnalytics
  await tx.commodityAnalytics.upsert({
    where: {commodityId_committeeId: {commodityId, committeeId}},
    update: {
      totalReceipts: {increment: 1},
      totalValue: {increment: value},
      totalFeesPaid: {increment: feesPaid},
      totalQuantity: {increment: totalWeightKg},
      lastTransactionDate: receiptDate,
    },
    create: {
      commodityId,
      committeeId,
      totalReceipts: 1,
      totalValue: value,
      totalFeesPaid: feesPaid,
      totalQuantity: totalWeightKg,
      lastTransactionDate: receiptDate,
    },
  });

  // Update CommitteeMonthlyAnalytics
  await tx.committeeMonthlyAnalytics.upsert({
    where: {committeeId_year_month: {committeeId, year, month}},
    update: {
      totalReceipts: {increment: 1},
      totalValue: {increment: value},
      totalFeesPaid: {increment: feesPaid},
      marketFees: {increment: feesPaid}, // or conditionally based on `natureOfReceipt`
    },
    create: {
      committeeId,
      year,
      month,
      totalReceipts: 1,
      totalValue: value,
      totalFeesPaid: feesPaid,
      marketFees: feesPaid,
    },
  });
};
