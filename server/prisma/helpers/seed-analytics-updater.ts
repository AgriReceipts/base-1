import {
  PrismaClient,
  CollectionLocation,
  NatureOfReceipt,
} from '@prisma/client';

/**
 * Encapsulates all database writes for a single day's batch of receipts for one committee.
 * This includes:
 * 1. Creating the Receipts.
 * 2. Upserting DailyAnalytics.
 * 3. Upserting CommitteeMonthlyAnalytics.
 * 4. Upserting TraderMonthlyAnalytics and TraderOverallAnalytics.
 * 5. Upserting CommodityMonthlyAnalytics and CommodityOverallAnalytics.
 * All operations are performed within a single transaction for data integrity.
 */
export async function processDayBatch(
  prisma: PrismaClient,
  committeeId: string,
  receiptDate: Date,
  receipts: any[]
): Promise<void> {
  // If there are no receipts to process for this day, exit early.
  if (receipts.length === 0) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    // 1. Create all receipts for this batch
    await tx.receipt.createMany({
      data: receipts,
      skipDuplicates: true, // Good practice
    });

    const year = receiptDate.getFullYear();
    const month = receiptDate.getMonth() + 1; // JS months are 0-11

    // --- FIX START ---
    // First, calculate the aggregate analytics for the current batch of receipts.
    // This `analytics` object was missing before, causing the upsert to fail.
    const analytics = calculateDayAnalytics(receipts, receiptDate, committeeId);
    // --- FIX END ---

    // 2. Upsert DailyAnalytics
    await tx.dailyAnalytics.upsert({
      where: {
        receiptDate_committeeId: {
          receiptDate,
          committeeId,
        },
      },
      // The `create` block uses the entire analytics object.
      create: analytics,
      // The `update` block uses fields from the calculated analytics to increment existing values.
      update: {
        totalReceipts: {increment: analytics.totalReceipts},
        totalValue: {increment: analytics.totalValue},
        totalFeesPaid: {increment: analytics.totalFeesPaid},
        totalQuantity: {increment: analytics.totalQuantity},
        mf_fees: {increment: analytics.mf_fees},
        lc_fees: {increment: analytics.lc_fees},
        uc_fees: {increment: analytics.uc_fees},
        others_fees: {increment: analytics.others_fees},
        officeFees: {increment: analytics.officeFees},
        checkpostFees: {increment: analytics.checkpostFees},
        otherFees: {increment: analytics.otherFees},
        // Note: Unique counts cannot be incremented this way. They are only set on creation.
        // A full recalculation would be needed to update them, which is too slow for this process.
      },
    });

    // 3. Update Committee-level Monthly Analytics
    await updateCommitteeAnalytics(tx, committeeId, year, month, receipts);

    // 4. Update Trader-level Monthly and Overall Analytics
    await updateTraderAnalytics(
      tx,
      committeeId,
      year,
      month,
      receiptDate,
      receipts
    );

    // 5. Update Commodity-level Monthly and Overall Analytics
    await updateCommodityAnalytics(tx, committeeId, year, month, receipts);
  });
}

/**
 * Calculates the daily aggregate values from a batch of receipts.
 * This function is now correctly called by `processDayBatch`.
 */
function calculateDayAnalytics(
  receipts: any[],
  receiptDate: Date,
  committeeId: string
): any {
  const totalReceipts = receipts.length;

  const totalValue = receipts.reduce(
    (sum, r) => sum + parseFloat(r.value.toString()),
    0
  );

  const totalFeesPaid = receipts.reduce(
    (sum, r) => sum + parseFloat(r.feesPaid.toString()),
    0
  );

  const totalQuantity = receipts.reduce(
    (sum, r) => sum + parseFloat(r.totalWeightKg?.toString() || '0'),
    0
  );

  const mf_fees = receipts
    .filter((r) => r.natureOfReceipt === NatureOfReceipt.mf)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const lc_fees = receipts
    .filter((r) => r.natureOfReceipt === NatureOfReceipt.lc)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const uc_fees = receipts
    .filter((r) => r.natureOfReceipt === NatureOfReceipt.uc)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const others_fees = receipts
    .filter((r) => r.natureOfReceipt === NatureOfReceipt.others)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const officeFees = receipts
    .filter((r) => r.collectionLocation === CollectionLocation.office)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const checkpostFees = receipts
    .filter((r) => r.collectionLocation === CollectionLocation.checkpost)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const otherFees = receipts
    .filter((r) => r.collectionLocation === CollectionLocation.other)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const uniqueTraders = new Set(receipts.map((r) => r.traderId)).size;

  const uniqueCommodities = new Set(receipts.map((r) => r.commodityId)).size;

  // The returned object matches the structure needed by Prisma's `dailyAnalytics.create`.
  return {
    receiptDate,
    committeeId,
    checkpostId: null, // Assuming this is not derived from receipts for now
    totalReceipts,
    totalValue,
    totalFeesPaid,
    totalQuantity,
    mf_fees,
    lc_fees,
    uc_fees,
    others_fees,
    officeFees,
    checkpostFees,
    otherFees,
    uniqueTraders,
    uniqueCommodities,
    monthToDateReceipts: totalReceipts,
    monthToDateValue: totalValue,
    monthToDateFees: totalFeesPaid,
    yearToDateReceipts: totalReceipts,
    yearToDateValue: totalValue,
    yearToDateFees: totalFeesPaid,
  };
}

async function updateCommitteeAnalytics(
  tx: any,
  committeeId: string,
  year: number,
  month: number,
  receipts: any[]
) {
  const totalReceipts = receipts.length;
  const totalValue = receipts.reduce(
    (sum, r) => sum + parseFloat(r.value.toString()),
    0
  );
  const totalFeesPaid = receipts.reduce(
    (sum, r) => sum + parseFloat(r.feesPaid.toString()),
    0
  );
  const marketFees = receipts
    .filter((r) => r.natureOfReceipt === NatureOfReceipt.mf)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);
  const officeFees = receipts
    .filter((r) => r.collectionLocation === CollectionLocation.office)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);
  const checkpostFees = receipts
    .filter((r) => r.collectionLocation === CollectionLocation.checkpost)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);
  const otherFees = receipts
    .filter((r) => r.collectionLocation === CollectionLocation.other)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  // Note: These unique counts are for the *current batch* only.
  // They are correct for the 'create' part of the upsert.
  const uniqueTraders = new Set(receipts.map((r) => r.traderId)).size;
  const uniqueCommodities = new Set(
    receipts.map((r) => r.commodityId).filter(Boolean)
  ).size;

  await tx.committeeMonthlyAnalytics.upsert({
    where: {committeeId_year_month: {committeeId, year, month}},
    create: {
      committeeId,
      year,
      month,
      totalReceipts,
      totalValue,
      totalFeesPaid,
      marketFees,
      officeFees,
      checkpostFees,
      otherFees,
      uniqueTraders,
      uniqueCommodities,
    },
    update: {
      totalReceipts: {increment: totalReceipts},
      totalValue: {increment: totalValue},
      totalFeesPaid: {increment: totalFeesPaid},
      marketFees: {increment: marketFees},
      officeFees: {increment: officeFees},
      checkpostFees: {increment: checkpostFees},
      otherFees: {increment: otherFees},
      // FIX 4 is preserved: We do NOT increment unique counts as it would be incorrect.
      // A full recalculation is too slow for a seeder. This is the correct approach.
    },
  });
}

async function updateTraderAnalytics(
  tx: any,
  committeeId: string,
  year: number,
  month: number,
  receiptDate: Date,
  receipts: any[]
) {
  const traderGroups = new Map<string, any[]>();
  for (const receipt of receipts) {
    if (!receipt.traderId) continue;
    if (!traderGroups.has(receipt.traderId)) {
      traderGroups.set(receipt.traderId, []);
    }
    traderGroups.get(receipt.traderId)!.push(receipt);
  }

  for (const [traderId, traderReceipts] of traderGroups) {
    const totalReceipts = traderReceipts.length;
    const totalValue = traderReceipts.reduce(
      (sum, r) => sum + parseFloat(r.value.toString()),
      0
    );
    const totalFeesPaid = traderReceipts.reduce(
      (sum, r) => sum + parseFloat(r.feesPaid.toString()),
      0
    );
    const totalQuantity = traderReceipts.reduce(
      (sum, r) => sum + parseFloat(r.totalWeightKg?.toString() || '0'),
      0
    );

    // Upsert Monthly Trader Analytics
    await tx.traderMonthlyAnalytics.upsert({
      where: {
        traderId_committeeId_year_month: {traderId, committeeId, year, month},
      },
      create: {
        traderId,
        committeeId,
        year,
        month,
        totalReceipts,
        totalValue,
        totalFeesPaid,
        totalQuantity,
      },
      update: {
        totalReceipts: {increment: totalReceipts},
        totalValue: {increment: totalValue},
        totalFeesPaid: {increment: totalFeesPaid},
        totalQuantity: {increment: totalQuantity},
      },
    });

    // NEW: Upsert Overall Trader Analytics
    await tx.traderOverallAnalytics.upsert({
      where: {traderId_committeeId: {traderId, committeeId}},
      create: {
        traderId,
        committeeId,
        totalReceipts,
        totalValue,
        totalFeesPaid,
        totalQuantity,
        firstTransactionDate: receiptDate,
        lastTransactionDate: receiptDate,
      },
      update: {
        totalReceipts: {increment: totalReceipts},
        totalValue: {increment: totalValue},
        totalFeesPaid: {increment: totalFeesPaid},
        totalQuantity: {increment: totalQuantity},
        lastTransactionDate: receiptDate, // Always update the last transaction date
      },
    });
  }
}

async function updateCommodityAnalytics(
  tx: any,
  committeeId: string,
  year: number,
  month: number,
  receipts: any[]
) {
  const commodityGroups = new Map<string, any[]>();
  for (const receipt of receipts) {
    if (!receipt.commodityId) continue;
    if (!commodityGroups.has(receipt.commodityId)) {
      commodityGroups.set(receipt.commodityId, []);
    }
    commodityGroups.get(receipt.commodityId)!.push(receipt);
  }

  for (const [commodityId, commodityReceipts] of commodityGroups) {
    const totalReceipts = commodityReceipts.length;
    const totalValue = commodityReceipts.reduce(
      (sum, r) => sum + parseFloat(r.value.toString()),
      0
    );
    const totalFeesPaid = commodityReceipts.reduce(
      (sum, r) => sum + parseFloat(r.feesPaid.toString()),
      0
    );
    const totalQuantity = commodityReceipts.reduce(
      (sum, r) => sum + parseFloat(r.totalWeightKg?.toString() || '0'),
      0
    );

    // Upsert Monthly Commodity Analytics
    await tx.commodityMonthlyAnalytics.upsert({
      where: {
        commodityId_committeeId_year_month: {
          commodityId,
          committeeId,
          year,
          month,
        },
      },
      create: {
        commodityId,
        committeeId,
        year,
        month,
        totalReceipts,
        totalValue,
        totalFeesPaid,
        totalQuantity,
      },
      update: {
        totalReceipts: {increment: totalReceipts},
        totalValue: {increment: totalValue},
        totalFeesPaid: {increment: totalFeesPaid},
        totalQuantity: {increment: totalQuantity},
      },
    });

    // NEW: Upsert Overall Commodity Analytics
    await tx.commodityOverallAnalytics.upsert({
      where: {commodityId_committeeId: {commodityId, committeeId}},
      create: {
        commodityId,
        committeeId,
        totalReceipts,
        totalValue,
        totalFeesPaid,
        totalQuantity,
      },
      update: {
        totalReceipts: {increment: totalReceipts},
        totalValue: {increment: totalValue},
        totalFeesPaid: {increment: totalFeesPaid},
        totalQuantity: {increment: totalQuantity},
      },
    });
  }
}
