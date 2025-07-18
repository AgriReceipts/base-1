import {
  PrismaClient,
  CollectionLocation,
  NatureOfReceipt,
} from '@prisma/client';

/**
 * Encapsulates all database writes for a single day's batch of receipts for one committee.
 * This version is updated to work with the simplified analytics schema focusing on market fees.
 */
export async function processDayBatch(
  prisma: PrismaClient,
  committeeId: string,
  receiptDate: Date,
  receipts: any[]
): Promise<void> {
  if (receipts.length === 0) {
    return;
  }

  try {
    // 1. Create all receipts for this batch
    await prisma.receipt.createMany({
      data: receipts,
      skipDuplicates: true,
    });

    const year = receiptDate.getFullYear();
    const month = receiptDate.getMonth() + 1;

    // Calculate the aggregate analytics for the current batch of receipts
    const analytics = calculateDayAnalytics(receipts, receiptDate, committeeId);

    // 2. Upsert DailyAnalytics
    await prisma.dailyAnalytics.upsert({
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
        marketFees: {increment: analytics.marketFees},
        totalQuantity: {increment: analytics.totalQuantity},
        officeFees: {increment: analytics.officeFees},
        checkpostFees: {increment: analytics.checkpostFees},
        otherFees: {increment: analytics.otherFees},
      },
    });

    // 3. Update Committee-level Monthly Analytics (and its checkposts)
    await updateCommitteeAnalytics(prisma, committeeId, year, month, receipts);

    // 4. Update Trader-level Monthly and Overall Analytics
    await updateTraderAnalytics(
      prisma,
      committeeId,
      year,
      month,
      receiptDate,
      receipts
    );

    // 5. Update Commodity-level Monthly and Overall Analytics
    await updateCommodityAnalytics(prisma, committeeId, year, month, receipts);
  } catch (error) {
    console.error(
      `Error processing day batch for committee ${committeeId} on ${receiptDate.toISOString()}:`,
      error
    );
    throw error;
  }
}

/**
 * Calculates daily aggregates with field names matching the DailyAnalytics schema.
 */
function calculateDayAnalytics(
  receipts: any[],
  receiptDate: Date,
  committeeId: string
): any {
  // Filter for market fee receipts first
  const marketFeeReceipts = receipts.filter(
    (r) => r.natureOfReceipt === NatureOfReceipt.mf
  );

  const marketFees = marketFeeReceipts.reduce(
    (sum, r) => sum + parseFloat(r.feesPaid.toString()),
    0
  );

  // Calculate market fee breakdown by location
  const officeFees = marketFeeReceipts
    .filter((r) => r.collectionLocation === CollectionLocation.office)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const checkpostFees = marketFeeReceipts
    .filter((r) => r.collectionLocation === CollectionLocation.checkpost)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  const otherFees = marketFeeReceipts
    .filter((r) => r.collectionLocation === CollectionLocation.other)
    .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0);

  // Calculate overall totals from all receipts
  const totalReceipts = receipts.length;
  const totalValue = receipts.reduce(
    (sum, r) => sum + parseFloat(r.value.toString()),
    0
  );
  const totalQuantity = receipts.reduce(
    (sum, r) => sum + parseFloat(r.totalWeightKg?.toString() || '0'),
    0
  );
  const uniqueTraders = new Set(receipts.map((r) => r.traderId)).size;
  const uniqueCommodities = new Set(receipts.map((r) => r.commodityId)).size;

  return {
    receiptDate,
    committeeId,
    checkpostId: null,
    totalReceipts,
    totalValue,
    marketFees,
    totalQuantity,
    officeFees,
    checkpostFees,
    otherFees,
    uniqueTraders,
    uniqueCommodities,
  };
}

/**
 * Updates CommitteeMonthlyAnalytics for the committee and for each checkpost.
 * The table uses a unique constraint on (committeeId, year, month) so we need to
 * aggregate all data for the committee into a single record.
 */
async function updateCommitteeAnalytics(
  prisma: any,
  committeeId: string,
  year: number,
  month: number,
  receipts: any[]
) {
  // Calculate aggregates for all receipts (committee + all checkposts combined)
  const allAggregates = calculateAggregates(receipts);

  // Get committee-level target - using the correct Target model structure
  const committeeTarget = await prisma.target.findFirst({
    where: {
      committeeId,
      year,
      month,
      checkpostId: null,
      isActive: true,
      type: 'OVERALL_COMMITTEE', // Assuming TargetType enum has COMMITTEE value
    },
    select: {marketFeeTarget: true},
  });

  // Since the unique constraint is on (committeeId, year, month), we create/update
  // a single record that represents the entire committee's monthly analytics
  await prisma.committeeMonthlyAnalytics.upsert({
    where: {
      committeeId_year_month: {
        committeeId,
        year,
        month,
      },
    },
    create: {
      committeeId,
      year,
      month,
      totalReceipts: allAggregates.totalReceipts,
      totalValue: allAggregates.totalValue,
      marketFees: allAggregates.marketFees,
      officeFees: allAggregates.officeMarketFees,
      checkpostMarketFees: allAggregates.checkpostMarketFees,
      otherFees: allAggregates.otherMarketFees,
      marketFeeTarget: committeeTarget?.marketFeeTarget || null,
      uniqueTraders: allAggregates.uniqueTraders,
      uniqueCommodities: allAggregates.uniqueCommodities,
    },
    update: {
      totalReceipts: {increment: allAggregates.totalReceipts},
      totalValue: {increment: allAggregates.totalValue},
      marketFees: {increment: allAggregates.marketFees},
      officeFees: {increment: allAggregates.officeMarketFees},
      checkpostMarketFees: {increment: allAggregates.checkpostMarketFees},
      otherFees: {increment: allAggregates.otherMarketFees},
      marketFeeTarget: committeeTarget?.marketFeeTarget || undefined,
    },
  });

  // Note: If you need checkpost-specific analytics, you would need a separate
  // table (e.g., CheckpostMonthlyAnalytics) since CommitteeMonthlyAnalytics
  // has a unique constraint that prevents multiple records per committee/month
}

/**
 * Helper to calculate aggregates for a given batch of receipts.
 * Used by updateCommitteeAnalytics for both committee and checkpost level.
 */
function calculateAggregates(receipts: any[]) {
  const marketFeeReceipts = receipts.filter(
    (r) => r.natureOfReceipt === NatureOfReceipt.mf
  );

  return {
    totalReceipts: receipts.length,
    totalValue: receipts.reduce(
      (sum, r) => sum + parseFloat(r.value.toString()),
      0
    ),
    marketFees: marketFeeReceipts.reduce(
      (sum, r) => sum + parseFloat(r.feesPaid.toString()),
      0
    ),
    officeMarketFees: marketFeeReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.office)
      .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0),
    checkpostMarketFees: marketFeeReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.checkpost)
      .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0),
    otherMarketFees: marketFeeReceipts
      .filter((r) => r.collectionLocation === CollectionLocation.other)
      .reduce((sum, r) => sum + parseFloat(r.feesPaid.toString()), 0),
    uniqueTraders: new Set(receipts.map((r) => r.traderId)).size,
    uniqueCommodities: new Set(
      receipts.map((r) => r.commodityId).filter(Boolean)
    ).size,
  };
}

async function updateTraderAnalytics(
  prisma: any,
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

    await prisma.traderMonthlyAnalytics.upsert({
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

    await prisma.traderOverallAnalytics.upsert({
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
        lastTransactionDate: receiptDate,
      },
    });
  }
}

async function updateCommodityAnalytics(
  prisma: any,
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

    await prisma.commodityMonthlyAnalytics.upsert({
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

    await prisma.commodityOverallAnalytics.upsert({
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
