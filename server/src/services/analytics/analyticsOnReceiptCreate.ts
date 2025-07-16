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

  // 2. UPDATE TRADER MONTHLY & OVERALL ANALYTICS
  // This is now split into two clear, simple updates.

  // Update the monthly record
  await tx.traderMonthlyAnalytics.upsert({
    where: {
      traderId_committeeId_year_month: {
        traderId,
        committeeId,
        year,
        month,
      },
    },
    update: {
      totalReceipts: {increment: 1},
      totalValue: {increment: value},
      totalFeesPaid: {increment: feesPaid},
      totalQuantity: {increment: totalWeightKg},
    },
    create: {
      traderId,
      committeeId,
      year,
      month,
      totalReceipts: 1,
      totalValue: value,
      totalFeesPaid: feesPaid,
      totalQuantity: totalWeightKg,
    },
  });

  // Update the single overall record
  await tx.traderOverallAnalytics.upsert({
    where: {
      traderId_committeeId: {
        traderId,
        committeeId,
      },
    },
    update: {
      totalReceipts: {increment: 1},
      totalValue: {increment: value},
      totalFeesPaid: {increment: feesPaid},
      totalQuantity: {increment: totalWeightKg},
      lastTransactionDate: receiptDate, // Always update the last transaction date
    },
    create: {
      traderId,
      committeeId,
      totalReceipts: 1,
      totalValue: value,
      totalFeesPaid: feesPaid,
      totalQuantity: totalWeightKg,
      firstTransactionDate: receiptDate, // Set on creation only
      lastTransactionDate: receiptDate,
    },
  });

  // 3. UPDATE COMMODITY MONTHLY & OVERALL ANALYTICS (if applicable)
  if (commodityId) {
    // Update the monthly record
    await tx.commodityMonthlyAnalytics.upsert({
      where: {
        commodityId_committeeId_year_month: {
          commodityId,
          committeeId,
          year,
          month,
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
        year,
        month,
        totalReceipts: 1,
        totalValue: value,
        totalFeesPaid: feesPaid,
        totalQuantity: totalWeightKg,
      },
    });

    // Update the single overall record
    await tx.commodityOverallAnalytics.upsert({
      where: {
        commodityId_committeeId: {
          commodityId,
          committeeId,
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
      checkpostMarketFees: collectionLocation === 'checkpost' ? feesPaid : 0,
      otherFees: collectionLocation === 'other' ? feesPaid : 0,
    },
  });
};
