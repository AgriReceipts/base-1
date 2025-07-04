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
  }: AnalyticsInput
) => {
  const year = receiptDate.getFullYear();
  const month = receiptDate.getMonth() + 1;

  await tx.traderAnalytics.update({
    where: {traderId_committeeId: {traderId, committeeId}},
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: value},
      totalFeesPaid: {decrement: feesPaid},
      totalQuantity: {decrement: totalWeightKg},
    },
  });

  await tx.commodityAnalytics.update({
    where: {commodityId_committeeId: {commodityId, committeeId}},
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: value},
      totalFeesPaid: {decrement: feesPaid},
      totalQuantity: {decrement: totalWeightKg},
    },
  });

  await tx.committeeMonthlyAnalytics.update({
    where: {committeeId_year_month: {committeeId, year, month}},
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: value},
      totalFeesPaid: {decrement: feesPaid},
      marketFees: {decrement: feesPaid},
    },
  });
};
