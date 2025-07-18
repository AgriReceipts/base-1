import {Prisma, NatureOfReceipt, CollectionLocation} from '@prisma/client';

// Assuming your Prisma schema defines these models correctly.
// The provided schema snippets are included at the bottom for context.

// Assuming AnalyticsInput is defined in this file or imported correctly
export interface AnalyticsInput {
  committeeId: string;
  traderId: string;
  commodityId: string | null;
  receiptDate: Date;
  value: number; // Using number for simplicity, can be Prisma.Decimal
  feesPaid: number; // Using number for simplicity, can be Prisma.Decimal
  totalWeightKg: number; // Using number for simplicity, can be Prisma.Decimal
  natureOfReceipt: NatureOfReceipt; // e.g., 'mf', 'sf', etc.
  collectionLocation: CollectionLocation; // e.g., 'office', 'checkpost', 'other'
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
    receiptDate.getMonth(),
    receiptDate.getDate()
  );

  // 1. UPDATE DAILY ANALYTICS - FIXED
  // Build the update payload dynamically
  const dailyUpdatePayload: Prisma.DailyAnalyticsUpdateInput = {
    totalReceipts: {increment: 1},
    totalValue: {increment: value},
    totalQuantity: {increment: totalWeightKg},
  };

  // Only increment market fees if nature is 'mf'
  if (natureOfReceipt === 'mf') {
    dailyUpdatePayload.marketFees = {increment: feesPaid};

    // Increment the correct location-specific fee counter
    if (collectionLocation === 'office') {
      dailyUpdatePayload.officeFees = {increment: feesPaid};
    } else if (collectionLocation === 'checkpost') {
      dailyUpdatePayload.checkpostFees = {increment: feesPaid};
    } else if (collectionLocation === 'other') {
      dailyUpdatePayload.otherFees = {increment: feesPaid};
    }
  }

  // Build the create payload
  const dailyCreatePayload: Prisma.DailyAnalyticsCreateInput = {
    receiptDate: day,
    committee: {connect: {id: committeeId}},
    totalReceipts: 1,
    totalValue: value,
    totalQuantity: totalWeightKg,
    marketFees: natureOfReceipt === 'mf' ? feesPaid : 0,
    officeFees:
      natureOfReceipt === 'mf' && collectionLocation === 'office'
        ? feesPaid
        : 0,
    checkpostFees:
      natureOfReceipt === 'mf' && collectionLocation === 'checkpost'
        ? feesPaid
        : 0,
    otherFees:
      natureOfReceipt === 'mf' && collectionLocation === 'other' ? feesPaid : 0,
  };

  // Only connect checkpost if collection location is 'checkpost' and checkpostId is provided
  if (collectionLocation === 'checkpost' && checkpostId) {
    dailyCreatePayload.checkpost = {connect: {id: checkpostId}};
  }

  await tx.dailyAnalytics.upsert({
    where: {
      receiptDate_committeeId: {
        receiptDate: day,
        committeeId,
      },
    },
    update: dailyUpdatePayload,
    create: dailyCreatePayload,
  });

  // 2. UPDATE TRADER MONTHLY & OVERALL ANALYTICS
  // This logic remains correct and unchanged.

  // Update the monthly record for the trader
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

  // Update the single overall record for the trader
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

  // 3. UPDATE COMMODITY MONTHLY & OVERALL ANALYTICS (if applicable)
  // This logic remains correct and unchanged.
  if (commodityId) {
    // Update the monthly record for the commodity
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

    // Update the single overall record for the commodity
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
  // This is the section with the corrected logic as per your request.

  // Start with the base payload for fields that are always updated.
  const committeeMonthlyUpdatePayload: Prisma.CommitteeMonthlyAnalyticsUpdateInput =
    {
      totalReceipts: {increment: 1},
      totalValue: {increment: value},
    };

  // **CORRECTION**: Only increment market fee fields if the receipt nature is 'mf'.
  if (natureOfReceipt === 'mf') {
    // Increment the main marketFees counter
    committeeMonthlyUpdatePayload.marketFees = {increment: feesPaid};

    // Increment the correct location-specific market fee counter.
    // Note the check for 'checkpostMarketFees' to match the schema.
    if (collectionLocation === 'office') {
      committeeMonthlyUpdatePayload.officeFees = {increment: feesPaid};
    } else if (collectionLocation === 'checkpost') {
      committeeMonthlyUpdatePayload.checkpostMarketFees = {increment: feesPaid};
    } else if (collectionLocation === 'other') {
      committeeMonthlyUpdatePayload.otherFees = {increment: feesPaid};
    }
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
      // **CORRECTION**: Ensure create logic also respects that fee breakdowns
      // are only for market fees ('mf').
      marketFees: natureOfReceipt === 'mf' ? feesPaid : 0,
      officeFees:
        natureOfReceipt === 'mf' && collectionLocation === 'office'
          ? feesPaid
          : 0,
      checkpostMarketFees:
        natureOfReceipt === 'mf' && collectionLocation === 'checkpost'
          ? feesPaid
          : 0,
      otherFees:
        natureOfReceipt === 'mf' && collectionLocation === 'other'
          ? feesPaid
          : 0,
    },
  });
};
