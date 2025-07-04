import {Prisma, PrismaClient} from '@prisma/client';
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
  const oldYear = old.receiptDate.getFullYear();
  const oldMonth = old.receiptDate.getMonth() + 1;
  const newYear = updated.receiptDate.getFullYear();
  const newMonth = updated.receiptDate.getMonth() + 1;

  // 1. Revert OLD values
  await tx.traderAnalytics.update({
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

  await tx.commodityAnalytics.update({
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

  await tx.committeeMonthlyAnalytics.update({
    where: {
      committeeId_year_month: {
        committeeId: old.committeeId,
        year: oldYear,
        month: oldMonth,
      },
    },
    data: {
      totalReceipts: {decrement: 1},
      totalValue: {decrement: old.value},
      totalFeesPaid: {decrement: old.feesPaid},
      marketFees: {decrement: old.feesPaid},
    },
  });

  // 2. Apply NEW values
  await updateAnalyticsOnReceiptCreate(tx, updated);
};
