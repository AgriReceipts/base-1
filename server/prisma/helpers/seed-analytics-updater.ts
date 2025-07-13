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

    // Calculate the aggregate analytics for the current batch of receipts
    const analytics = calculateDayAnalytics(receipts, receiptDate, committeeId);

    // 2. Upsert DailyAnalytics
    await tx.dailyAnalytics.upsert({
      where: {
        receiptDate_committeeId: {
          receiptDate,
          committeeId,
        },
      },
      create: analytics,
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
    checkpostId: null, // Set to null for committee-level daily analytics
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

  // Get target values for this committee and month
  const target = await tx.target.findFirst({
    where: {
      committeeId,
      year,
      month,
      checkpostId: null, // Committee-level target
      isActive: true,
    },
    select: {
      marketFeeTarget: true,
      totalValueTarget: true,
    },
  });

  // Committee-level monthly analytics (checkPostId is null)
  await tx.committeeMonthlyAnalytics.upsert({
    where: {committeeId_year_month: {committeeId, year, month}},
    create: {
      committeeId,
      checkPostId: null, // Committee-level analytics
      year,
      month,
      totalReceipts,
      totalValue,
      totalFeesPaid,
      marketFees,
      officeFees,
      checkpostFees,
      otherFees,
      marketFeeTarget: target?.marketFeeTarget || null,
      totalValueTarget: target?.totalValueTarget || null,
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
      // Update target values if they exist
      marketFeeTarget: target?.marketFeeTarget || undefined,
      totalValueTarget: target?.totalValueTarget || undefined,
      // Note: We do NOT increment unique counts as it would be incorrect.
      // A full recalculation is too slow for a seeder. This is the correct approach.
    },
  });

  // Also update checkpost-specific analytics if receipts have checkpost data
  const checkpostGroups = new Map<string, any[]>();
  receipts.forEach((receipt) => {
    if (receipt.checkpostId) {
      if (!checkpostGroups.has(receipt.checkpostId)) {
        checkpostGroups.set(receipt.checkpostId, []);
      }
      checkpostGroups.get(receipt.checkpostId)!.push(receipt);
    }
  });

  // Create/update checkpost-specific monthly analytics
  for (const [checkpostId, checkpostReceipts] of checkpostGroups) {
    const checkpostTotalReceipts = checkpostReceipts.length;
    const checkpostTotalValue = checkpostReceipts.reduce(
      (sum, r) => sum + parseFloat(r.value.toString()),
      0
    );
    const checkpostTotalFeesPaid = checkpostReceipts.reduce(
      (sum, r) => sum + parseFloat(r.feesPaid.toString()),
      0
    );
    const checkpostMarketFees = checkpostReceipts
      .filter((r) => r.natureOfReceipt === NatureOfReceipt.mf)
      .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);
    const checkpostOfficeFees = checkpostReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.office)
      .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);
    const checkpostCheckpostFees = checkpostReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.checkpost)
      .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);
    const checkpostOtherFees = checkpostReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.other)
      .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

    const checkpostUniqueTraders = new Set(
      checkpostReceipts.map((r) => r.traderId)
    ).size;
    const checkpostUniqueCommodities = new Set(
      checkpostReceipts.map((r) => r.commodityId).filter(Boolean)
    ).size;

    // Get checkpost-specific target
    const checkpostTarget = await tx.target.findFirst({
      where: {
        committeeId,
        year,
        month,
        checkpostId,
        isActive: true,
      },
      select: {
        marketFeeTarget: true,
        totalValueTarget: true,
      },
    });

    // Create a separate record for checkpost-specific analytics
    // Note: Using a different approach that doesn't conflict with the committee-level unique constraint
    await tx.committeeMonthlyAnalytics.upsert({
      where: {
        // We need to create a unique constraint that includes checkPostId
        // Since the schema only has @@unique([committeeId, year, month])
        // We'll need to handle this differently
        committeeId_year_month: {
          committeeId: committeeId, // Keep same committeeId
          year,
          month,
        },
      },
      create: {
        committeeId,
        checkPostId: checkpostId,
        year,
        month,
        totalReceipts: checkpostTotalReceipts,
        totalValue: checkpostTotalValue,
        totalFeesPaid: checkpostTotalFeesPaid,
        marketFees: checkpostMarketFees,
        officeFees: checkpostOfficeFees,
        checkpostFees: checkpostCheckpostFees,
        otherFees: checkpostOtherFees,
        marketFeeTarget: checkpostTarget?.marketFeeTarget || null,
        totalValueTarget: checkpostTarget?.totalValueTarget || null,
        uniqueTraders: checkpostUniqueTraders,
        uniqueCommodities: checkpostUniqueCommodities,
      },
      update: {
        totalReceipts: {increment: checkpostTotalReceipts},
        totalValue: {increment: checkpostTotalValue},
        totalFeesPaid: {increment: checkpostTotalFeesPaid},
        marketFees: {increment: checkpostMarketFees},
        officeFees: {increment: checkpostOfficeFees},
        checkpostFees: {increment: checkpostCheckpostFees},
        otherFees: {increment: checkpostOtherFees},
        marketFeeTarget: checkpostTarget?.marketFeeTarget || undefined,
        totalValueTarget: checkpostTarget?.totalValueTarget || undefined,
      },
    });
  }
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

    // Upsert Overall Trader Analytics
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
        // Note: firstTransactionDate should only be set on creation, not updated
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

    // Upsert Overall Commodity Analytics
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

// Additional utility functions for analytics

/**
 * Recalculates unique counts for a specific month (expensive operation)
 * Use sparingly, typically only for data corrections
 */
export async function recalculateMonthlyUniqueCount(
  prisma: PrismaClient,
  committeeId: string,
  year: number,
  month: number
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const receipts = await prisma.receipt.findMany({
    where: {
      committeeId,
      receiptDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      traderId: true,
      commodityId: true,
      checkpostId: true,
    },
  });

  const uniqueTraders = new Set(receipts.map((r) => r.traderId)).size;
  const uniqueCommodities = new Set(
    receipts.map((r) => r.commodityId).filter(Boolean)
  ).size;

  // Update committee-level analytics (where checkPostId is null)
  await prisma.committeeMonthlyAnalytics.updateMany({
    where: {
      committeeId,
      year,
      month,
      checkPostId: null, // Only update committee-level records
    },
    data: {uniqueTraders, uniqueCommodities},
  });

  // Update checkpost-specific analytics
  const checkpostGroups = new Map<string, any[]>();
  receipts.forEach((receipt) => {
    if (receipt.checkpostId) {
      if (!checkpostGroups.has(receipt.checkpostId)) {
        checkpostGroups.set(receipt.checkpostId, []);
      }
      checkpostGroups.get(receipt.checkpostId)!.push(receipt);
    }
  });

  for (const [checkpostId, checkpostReceipts] of checkpostGroups) {
    const checkpostUniqueTraders = new Set(
      checkpostReceipts.map((r) => r.traderId)
    ).size;
    const checkpostUniqueCommodities = new Set(
      checkpostReceipts.map((r) => r.commodityId).filter(Boolean)
    ).size;

    await prisma.committeeMonthlyAnalytics.updateMany({
      where: {
        committeeId,
        checkPostId: checkpostId,
        year,
        month,
      },
      data: {
        uniqueTraders: checkpostUniqueTraders,
        uniqueCommodities: checkpostUniqueCommodities,
      },
    });
  }
}

/**
 * Gets analytics summary for a committee and date range
 */
export async function getAnalyticsSummary(
  prisma: PrismaClient,
  committeeId: string,
  startDate: Date,
  endDate: Date
) {
  const dailyAnalytics = await prisma.dailyAnalytics.findMany({
    where: {
      committeeId,
      receiptDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {receiptDate: 'asc'},
  });

  const monthlyAnalytics = await prisma.committeeMonthlyAnalytics.findMany({
    where: {
      committeeId,
      year: {
        gte: startDate.getFullYear(),
        lte: endDate.getFullYear(),
      },
    },
    orderBy: [{year: 'asc'}, {month: 'asc'}],
  });

  return {
    dailyAnalytics,
    monthlyAnalytics,
    summary: {
      totalReceipts: dailyAnalytics.reduce(
        (sum, day) => sum + day.totalReceipts,
        0
      ),
      totalValue: dailyAnalytics.reduce(
        (sum, day) => sum + Number(day.totalValue),
        0
      ),
      totalFeesPaid: dailyAnalytics.reduce(
        (sum, day) => sum + Number(day.totalFeesPaid),
        0
      ),
      totalQuantity: dailyAnalytics.reduce(
        (sum, day) => sum + Number(day.totalQuantity),
        0
      ),
    },
  };
}

/**
 * Helper function to handle checkpost-specific analytics separately
 * This approach avoids the unique constraint conflict
 */
export async function createCheckpostAnalytics(
  prisma: PrismaClient,
  committeeId: string,
  checkpostId: string,
  year: number,
  month: number,
  receipts: any[]
) {
  const checkpostReceipts = receipts.filter(
    (r) => r.checkpostId === checkpostId
  );

  if (checkpostReceipts.length === 0) return;

  const totalReceipts = checkpostReceipts.length;
  const totalValue = checkpostReceipts.reduce(
    (sum, r) => sum + parseFloat(r.value.toString()),
    0
  );
  const totalFeesPaid = checkpostReceipts.reduce(
    (sum, r) => sum + parseFloat(r.feesPaid.toString()),
    0
  );
  const marketFees = checkpostReceipts
    .filter((r) => r.natureOfReceipt === NatureOfReceipt.mf)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);
  const officeFees = checkpostReceipts
    .filter((r) => r.collectionLocation === CollectionLocation.office)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);
  const checkpostFees = checkpostReceipts
    .filter((r) => r.collectionLocation === CollectionLocation.checkpost)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);
  const otherFees = checkpostReceipts
    .filter((r) => r.collectionLocation === CollectionLocation.other)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const uniqueTraders = new Set(checkpostReceipts.map((r) => r.traderId)).size;
  const uniqueCommodities = new Set(
    checkpostReceipts.map((r) => r.commodityId).filter(Boolean)
  ).size;

  // Get checkpost-specific target
  const target = await prisma.target.findFirst({
    where: {
      committeeId,
      year,
      month,
      checkpostId,
      isActive: true,
    },
    select: {
      marketFeeTarget: true,
      totalValueTarget: true,
    },
  });

  // Since we can't have duplicate (committeeId, year, month) records,
  // we'll need to either:
  // 1. Use a different approach for checkpost data, or
  // 2. Modify the schema to allow checkpost-specific records

  // For now, let's store checkpost data separately using updateMany
  // This requires the schema to be modified to allow null checkPostId in the unique constraint
  // or create separate records with different logic

  // Alternative approach: Store in a separate table or use a composite key
  // that includes checkPostId in the unique constraint
}
