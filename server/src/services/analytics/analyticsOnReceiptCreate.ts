import {Prisma, NatureOfReceipt, CollectionLocation} from '@prisma/client';

// Assuming AnalyticsInput is defined in this file or imported correctly
export interface AnalyticsInput {
  committeeId: string;
  traderId: string;
  commodityId: string | null;
  receiptDate: Date;
  value: number; // Use Prisma.Decimal or number depending on your setup
  feesPaid: number; // Use Prisma.Decimal or number
  totalWeightKg: number; // Use Prisma.Decimal or number
  natureOfReceipt: NatureOfReceipt;
  collectionLocation: CollectionLocation;
  checkpostId: string | null;
}

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
    natureOfReceipt,
    collectionLocation,
    checkpostId,
  }: AnalyticsInput
) => {
  const year = receiptDate.getFullYear();
  const month = receiptDate.getMonth() + 1;
  // Normalize date to the start of the day for daily analytics uniqueness
  const day = new Date(
    receiptDate.getFullYear(),
    receiptDate.getMonth() + 1,
    receiptDate.getDate()
  );

  // 1. UPDATE DAILY ANALYTICS
  // This logic is correct. It uses the `checkpostId` (which can be null) as part
  // of the unique key to separate office data from checkpost-specific data.
  await tx.dailyAnalytics.upsert({
    where: {
      receiptDate_committeeId: {
        receiptDate: day,
        committeeId,
      },
    },
    update: {
      totalReceipts: {increment: 1},
      totalValue: {increment: value},
      totalFeesPaid: {increment: feesPaid},
      totalQuantity: {increment: totalWeightKg},
      // Dynamic updates for fee nature and location breakdowns
      [`${natureOfReceipt}_fees`]: {increment: feesPaid},
      [`${collectionLocation}Fees`]: {increment: feesPaid},
    },
    create: {
      receiptDate: day,
      committeeId,
      checkpostId,
      totalReceipts: 1,
      totalValue: value,
      totalFeesPaid: feesPaid,
      totalQuantity: totalWeightKg,
      // Initialize all specific fee fields on creation
      mf_fees: natureOfReceipt === 'mf' ? feesPaid : 0,
      lc_fees: natureOfReceipt === 'lc' ? feesPaid : 0,
      uc_fees: natureOfReceipt === 'uc' ? feesPaid : 0,
      others_fees: natureOfReceipt === 'others' ? feesPaid : 0,
      officeFees: collectionLocation === 'office' ? feesPaid : 0,
      checkpostFees: collectionLocation === 'checkpost' ? feesPaid : 0,
      otherFees: collectionLocation === 'other' ? feesPaid : 0,
    },
  });

  // 2. UPDATE TRADER ANALYTICS
  await tx.traderAnalytics.upsert({
    where: {
      traderId_committeeId_receiptDate: {
        traderId,
        committeeId,
        receiptDate: day,
      },
    },
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
      receiptDate: day,
      totalReceipts: 1,
      totalValue: value,
      totalFeesPaid: feesPaid,
      totalQuantity: totalWeightKg,
      firstTransactionDate: receiptDate,
      lastTransactionDate: receiptDate,
    },
  });

  // 3. UPDATE COMMODITY ANALYTICS
  if (commodityId) {
    await tx.commodityAnalytics.upsert({
      where: {
        commodityId_committeeId_receiptDate: {
          commodityId,
          committeeId,
          receiptDate: day,
        },
      },
      update: {
        totalReceipts: {increment: 1},
        totalValue: {increment: value},
        totalFeesPaid: {increment: feesPaid},
        totalQuantity: {increment: totalWeightKg},
      },
      create: {
        commodityId,
        committeeId,
        receiptDate: day,
        totalReceipts: 1,
        totalValue: value,
        totalFeesPaid: feesPaid,
        totalQuantity: totalWeightKg,
      },
    });
  }

  // 4. UPDATE COMMITTEE MONTHLY ANALYTICS (CORRECTED LOGIC)
  // This block is now corrected to only update fields that exist on the CommitteeMonthlyAnalytics model.
  const committeeMonthlyUpdatePayload: Prisma.CommitteeMonthlyAnalyticsUpdateInput =
    {
      totalReceipts: {increment: 1},
      totalValue: {increment: value},
      totalFeesPaid: {increment: feesPaid},
      // This dynamic key correctly maps to `officeFees`, `checkpostFees`, or `otherFees`
      [`${collectionLocation}Fees`]: {increment: feesPaid},
    };

  // The monthly model only tracks `marketFees` specifically from the nature breakdown.
  if (natureOfReceipt === 'mf') {
    committeeMonthlyUpdatePayload.marketFees = {increment: feesPaid};
  }

  await tx.committeeMonthlyAnalytics.upsert({
    where: {committeeId_year_month: {committeeId, year, month}},
    update: committeeMonthlyUpdatePayload,
    create: {
      committeeId,
      year,
      month,
      totalReceipts: 1,
      totalValue: value,
      totalFeesPaid: feesPaid,
      // Initialize all relevant fields correctly on creation
      marketFees: natureOfReceipt === 'mf' ? feesPaid : 0,
      officeFees: collectionLocation === 'office' ? feesPaid : 0,
      checkpostFees: collectionLocation === 'checkpost' ? feesPaid : 0,
      otherFees: collectionLocation === 'other' ? feesPaid : 0,
    },
  });
};
